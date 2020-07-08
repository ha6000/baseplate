// Requiring modules

global.discord = require('discord.js');
const Ajv = require('ajv');
const ajv = new Ajv();
const chalk = require('chalk');
global.config = Object.assign({}, {
	prefix: '!',
	itents: ['GUILDS', 'GUILD_MESSAGES'],
	collections: ['commands', 'aliases'],
	handlers: ['command', 'event', 'utils'],
	commandGroups: ['owner'],
	eventGroups: ['logging', 'guild'],
	utils: []
}, require('../config.json'));

// Validating config
const validateConfig = ajv.compile({
	token: { type: String, default: 'test'},
	collections: { type: Array, items: String },
	handlers: { type: Array, items: String },
	commandGroups: { type: Array, items: String },
	eventGroups: { type: Array, items: String },
	utils: { type: Array, items: String },
	required: ['token']
});

const configValid = validateConfig(config);

if (!configValid) return console.error('Config invalid:', ajv.errorsText(validateConfig.errors));

// Creating client
const client = new discord.Client({ws: {intents: config.intents}});

// Creating collections
config.collections.forEach((collection) => (client[collection] = new discord.Collection()));

// Loading handlers
(async () => {
	const handlers = config.handlers;
	for (let i = 0; i < handlers.length; i++) {
		const handler = handlers[i];
		try {
			await (require(`./handlers/${handler}`))(client);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading handler ${chalk.bold(handler)}`);
		}
	}
	client.login(config.token);
})();