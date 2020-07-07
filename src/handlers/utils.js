const Ajv = require('ajv');
const ajv = new Ajv();
const { join } = require('path');
const chalk = require('chalk');

const validateUtil = ajv.compile({
	name: { type: String },
	construct: { type: Function },
	required: ['name', 'construct']
})

const utilsFolder = join(__dirname, '../utils');

module.exports = async (client) => {
	client.utils = {};
	const utilFiles = config.utils;

	for (let i = 0; i < utilFiles.length; i++) {
		const utilName = utilFiles[i];
		let util;
		try {
			util = require(path.join(utilsFolder, utilName));
			if (!util) {
				console.error('empty util');
				continue;
			}
			const validUtil = validateUtil(util);
			if (!validUtil) {
				console.error(ajv.errorsText(validateUtil.errors));
			}
			client.utils[util.name] = await util.construct(client);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading util ${chalk.bold(utilName)}`);
		}
	}
};
