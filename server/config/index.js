const path = require("path");
const rootPath = path.dirname(__dirname);

const db = {
	host: "localhost",
	port: "3306",
	user: "root",
	password: "",
	database: "vitalik14-3177_test",
	salt: "Th8uhfmkyh"
};

const connect = {
	port: 3004
};

const user = {
	defaultAvatarPath: "files/default/default.png"
};

module.exports = {
	db,
	connect,
	rootPath,
	user
};
