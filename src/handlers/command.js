const Ajv = require('ajv');
const ajv = new Ajv();
const { readdirSync } = require('fs');
const { join } = require('path');

const validateCommand = ajv.compile({
	name: { type: String },
	aliases: { type: Array, items: String },
	run: { type: Function},
	required: ['name', 'run']
});

const commandFolder = join(__dirname, '../commands');

module.exports = (client) => {
	config.commandGroups.forEach(dir => {
		const groupPath = join(commandFolder, dir)
		readdirSync(groupPath).filter(d => d.endsWith('.js'))
		.forEach(file => {
			let commandFile = require(join(groupPath, file));
			if (!commandFile) return;
			commandFile = Object.assign({}, {
				aliases: []
			}, commandFile);
			const commandValid = validateCommand(commandFile);
			if (!commandValid) return console.error(`Command '${file}' invalid: `, ajv.errorsText(validateCommand.errors));

			client.commands.set(commandFile.name, commandFile);
			commandFile.aliases.forEach(alias => client.aliases.set(alias, commandFile.name));
		});
	});
};
