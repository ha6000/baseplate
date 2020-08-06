const { readdirSync } = require('fs');
const { join } = require('path');

const commandFolder = join(__dirname, '../commands');

module.exports = (client) => {
	config.commandGroups.forEach(dir => {
		const groupPath = join(commandFolder, dir)
		readdirSync(groupPath).filter(d => d.endsWith('.js'))
		.forEach(file => {
			let commandFile = require(join(groupPath, file));
			if (!commandFile || !commandFile.name || !commandFile.execute) return;
			commandFile = Object.assign({}, {
				aliases: []
			}, commandFile);

			client.commands.set(commandFile.name, commandFile);
			commandFile.aliases.forEach(alias => client.aliases.set(alias, commandFile.name));
		});
	});
};
