const { id, discord } = require('../config');
const snek = require('snekfetch');

module.exports = async ignore => {
	const { body: assets } = await snek.get(`https://discordapp.com/api/oauth2/applications/${id}/assets`);
	for (const asset of assets) {
		if (!/^[0-9][0-9a-z]{21}$/.test(asset.name) || ignore.includes(asset.name)) continue;
		await snek.delete(`https://discordapp.com/api/oauth2/applications/${id}/assets/${asset.id}`).set('Authorization', discord.replace(/"(.*)"/, '$1'));
	}
};