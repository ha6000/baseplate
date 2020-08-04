const { MessageEmbed, Collection } = discord;
const prefix = config.prefix;

module.exports = async (client, message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	// Gets command name and arguments
	const rawArgs = message.content.slice(prefix.length).trim();
	const args = rawArgs.split(/ +/g);
	const cmd = args.shift().toLowerCase();
	let argString = ''
	if (args.length > 0) {
		argString = message.content.slice(message.content.indexOf(' ') + 1);
	}

	const commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
	if (!commandFile) return;
	if (!commandFile.dm && message.author.bot) return;
	try {
		await commandFile.run({ client, message, args, utils: client.utils, rawArgs, argString });
	}
	catch (err) {
		console.error(err);
		message.reply('Command failed');
	}
};
