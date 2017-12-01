const { id, images, transport } = require('./config');
const log = require('./log');

const { Client } = require('discord-rpc');
const client = new Client({ transport });

const Spotify = require('./spotify');
const spotify = new Spotify();

const activity = {
	details: '🎵 None',
	smallImageKey: images.paused,
	largeImageKey: images.logo
};

const set = (song, image) => {
	activity.details = `🎵 ${song.title}`;
	activity.state = `👤 ${song.artist}`;
	activity.smallImageKey = image;
};

let last = Date.now();
let timeout;

const update = () => {
	const next = last + 15e3 - Date.now();
	if (next >= 0) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			client.setActivity(activity);
			last = Date.now();
		}, next);
	} else {
		client.setActivity(activity);
		last = Date.now();
	}
};

client.on('ready', () => {
	log('Connected to Discord!');
	spotify.run()
		.then(() => log('Connected to Spotify!'))
		.catch(log);
});

spotify.on('song', song => {
	log(`New Song: ${song.title}`);
	set(song, images.playing);
	update();
});

spotify.on('unpause', song => {
	log('Song Unpaused!');
	set(song, images.playing);
	update();
});

spotify.on('pause', () => {
	log('Song Paused!');
	activity.smallImageKey = images.paused;
	update();
});

spotify.on('stop', () => {
	log('Nothing Playing!');
	activity.details = '🎵 Nothing';
	activity.smallImageKey = images.stopped;
	delete activity.state;
	update();
});

spotify.on('error', console.error);

client.login(id).catch(console.error);