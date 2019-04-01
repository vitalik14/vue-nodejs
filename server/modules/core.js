const express = require("express");
const app = express();
const config = require('../config');
const bodyParser = require('body-parser');

app.set("views", "./views");
app.set("view engine", "pug");
app.use('/files', express.static('files/'));
app.use('/upload', express.static('upload/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);

	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type,Authorization"
	);

	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", 'no-cache');

	// res.setHeader("Cache-Control", 'no-cache');

	// res.setHeader("Content-Type", "text/event-stream; charset=utf-8");

	// skip check to browser
	if (req.method === 'OPTIONS') {
		res.send({forBrowser: 1});
		return;
	} else {
		next();
	}
	
});

app.listen(config.connect.port);

module.exports = app;