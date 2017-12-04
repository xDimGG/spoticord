const { get } = require('snekfetch');
const { Client } = require('discord-rpc');
const { readFileSync } = require('fs');

const { discord, enabled, id, images, transport } = require('./config');
const Spotify = require('./utils/spotify');
const upload = require('./utils/upload');
const remove = require('./utils/remove');
const log = require('./utils/log');

const client = new Client({ transport });
const spotify = new Spotify();

try {
	const path = process.platform === 'win32' ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/hosts/etc';
	const file = readFileSync(path);
	if (file.includes('open.spotify.com')) {
		log(`Arr' yer be pirating! Please remove your "open.spotify.com" rule from your hosts file located in ${path}`);
		process.exit(1);
	}
} catch (error) {} // eslint-disable-line no-empty

const activity = {
	state: '🎵 Nothing',
	largeImageKey: images.logo
};

let img = {};
let last = 0;
let timeout;

const set = (song, image, playing = true) => {
	activity.details = `🎵 ${song.title}`;
	activity.state = `👤 ${song.artist.name || 'Unknown'}`;

	if (enabled.largeImage) activity.largeImageKey = img.large ? img.large.name : images.logo;
	if (enabled.largeImage && enabled.largeImageText) activity.largeImageText = song.title;

	if (enabled.smallImage) activity.smallImageKey = img.small ? img.small.name : image;
	if (enabled.smallImage && enabled.smallImageText) activity.smallImageText = song.artist.name || 'Unknown';

	if (enabled.timeLeft) activity.startTimestamp = playing ? Math.floor(Date.now() / 1000) - song.played : null;
	if (enabled.timeLeft) activity.endTimestamp = playing ? activity.startTimestamp + song.length : null;
	update();
};

const update = async () => {
	const next = last + 15e3 - Date.now();
	if (next >= 0) {
		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			await client.setActivity(activity);
			last = Date.now();
		}, next);
	} else {
		await client.setActivity(activity);
		last = Date.now();
	}
};

client.on('ready', () => {
	log('Connected to Discord!');
	spotify.run().then(() => log('Connected to Spotify!'));
});

spotify.on('song', async song => {
	log(`New Song: ${song.title}`);
	if (discord && (enabled.largeImage && enabled.largeAlbumCovers || enabled.smallImage && enabled.smallAlbumCovers)) {
		await remove(Object.values(img).map(i => i.name));		
	}
	if (discord && enabled.largeImage && enabled.largeAlbumCovers) {
		if (!img.large || img.large.name !== song.artist.id) {
			const { text: html } = await get(`https://open.spotify.com/embed/track/${song.id}`);
			img.large = await upload(html.replace(/(?:.|\s)*?data-size-640="(https:\/\/i\.scdn\.co\/image\/\w+)"(?:.|\s)*/, '$1'), song.id, 2);
		}
	}
	if (discord && enabled.smallImage && enabled.smallAlbumCovers) {
		if (!img.large || img.large.name !== song.artist.id) {
			const { text: html } = await get(`https://open.spotify.com/embed/artist/${song.artist.id}`);
			img.small = await upload(html.replace(/(?:.|\s)*?\('(https:\/\/i\.scdn\.co\/image\/\w+)(?:.|\s)*/, '$1'), song.artist.id, 1);
		}
	}
	set(song, images.playing);
});

spotify.on('unpause', song => {
	log('Song Resumed!');
	set(song, images.playing);
});

spotify.on('pause', song => {
	log('Song Paused!');
	set(song, images.paused, false);
});

spotify.on('stop', () => {
	log('Nothing Playing!');
	activity.state = '🎵 Nothing';
	activity.details = null;
	if (enabled.largeImage) activity.largeImageKey = images.logo;
	if (enabled.timeLeft) activity.startTimestamp = null;
	if (enabled.timeLeft) activity.endTimestamp = null;
	update();
});

spotify.on('error', console.error);

client.login(id).catch(console.error);