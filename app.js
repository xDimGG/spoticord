const { id, images, transport } = require('./config');
const log = require('./log');

const { Client } = require('discord-rpc');
const client = new Client({ transport });

const Spotify = require('./spotify');
const spotify = new Spotify();

const activity = {
	details: '🎵 Nothing',
	smallImageKey: images.paused,
	largeImageKey: images.logo
};

const set = (song, image) => {
	activity.details = `🎵 ${song.title}`;
	activity.state = `👤 ${song.artist}`;
	activity.smallImageKey = image;
	activity.startTimestamp = Math.floor(Date.now() / 1000) - song.played;
	activity.endTimestamp = activity.startTimestamp + song.length;
};

let last = 0;
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
	spotify.run().then(() => log('Connected to Spotify!'));
});

spotify.on('song', song => {
	// console.log(song);
	log(`New Song: ${song.title}`);
	set(song, images.playing);
	update();
});

spotify.on('unpause', song => {
	log('Song Unpaused!');
	set(song, images.playing);
	update();
});

spotify.on('pause', song => {
	log('Song Paused!');
	set(song, images.paused);
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