const mysql = require("mysql");
const config = require("../config");

function db(query, data) {
	return new Promise((resolve, reject) => {
		let result;
		const connection = mysql.createConnection({
			host: config.db.host,
			port: config.db.port,
			user: config.db.user,
			password: config.db.password,
			database: config.db.database
		});

		connection.connect();

		if (query) {
			connection.query(query, data, function (error, results, fields) {
				if (error) {
					result = { results: [], error };
				} else {
					result = { results };
				}
				connection.end();
				resolve(result);
			});
		} else {
			resolve(connection);
		}
	});
}

module.exports = db;
