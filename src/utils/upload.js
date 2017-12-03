const { discord, id } = require('../config');
const { get, post } = require('snekfetch');

module.exports = async (url, name, type) => {
	const { body: buffer } = await get(url);
	const image = `data:image/png;base64,${buffer.toString('base64')}`;
	const { body: asset } = await post(`https://discordapp.com/api/oauth2/applications/${id}/assets`)
		.set('Authorization', discord.replace(/"(.*)"/, '$1'))
		.send({	image, name, type });
	return asset;
};