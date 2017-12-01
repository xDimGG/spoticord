const pad = (str, len = 2) => {
	if (typeof str !== 'string') str = `${str}`;
	return str.length >= len ? str : `${'0'.repeat(len - str.length)}${str}`;
};

module.exports = text => {
	const date = new Date();
	const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	console.log(`\x1b[1m[${time}]\x1b[0m ${text}`);
};