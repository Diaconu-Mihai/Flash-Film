const { readFile } = require("fs/promises");

const fileReaderAsync = async (filePath) => {
	try {
		return JSON.parse(await readFile(filePath));
	} catch (error) {
		console.error(`File reading error: ${error.message}`);
	}
};

module.exports = fileReaderAsync;