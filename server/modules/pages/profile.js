const consts = require("../../config/consts");
const md5 = require("js-md5");
const fs = require("fs");
const sizeOf = require("image-size");

module.exports = function(app, db, users) {
	app.post("/profile_foto", function(req, res) {
		let user_id = users.getUserId(req.headers.authorization);
		let file_hash = md5(user_id.toString()).slice(20);
		let body = "";
		let header = "";
		let content_type = req.headers["content-type"];
		let boundary = content_type.split("; ")[1].split("=")[1];
		let content_length = parseInt(req.headers["content-length"]);
		let headerFlag = true;
		let filename = "dummy.bin";
		let filenameRegexp = /filename="(.*)"/m;

		if (content_length > 120000) {
			res.send({ 
				status: consts.ERROR, 
				message: "picture_maximum_120_kb" 
			});

			return;
		}

		req.on("data", function(raw) {
			let i = 0;

			try {
				while (i < raw.length) {
					if (headerFlag) {
						let chars = raw.slice(i, i + 4).toString();

						if (chars === "\r\n\r\n") {
							headerFlag = false;
							header = raw.slice(0, i + 4).toString();
							if (header.search(/image\/png|image\/jpeg/) === -1) {
								res.send({
									status: consts.ERROR,
									message: "only_jpeg_or_png_format"
								});

								return;
							}
							i = i + 4;

							let result = filenameRegexp.exec(header);

							if (result[1]) {
								filename = result[1];
							}
						} else {
							i += 1;
						}

					} else {
						body += raw.toString("binary", i, raw.length);
						i = raw.length;
					}
				}
			} catch (e) {
				res.send({ 
					status: consts.ERROR, 
					message: "unknown_error"
				});
			}
		});

		req.on("end", function() {
			if (res.finished) {
				return;
			}
			let filePath = "files/" + file_hash + "/" + filename;

			body = body.slice(0, body.length - (boundary.length + 8));

			try {
				fs.writeFileSync("files/temp/" + filename, body, "binary");
			} catch (e) {
				res.send({ 
					status: consts.ERROR, 
					message: "error_load_img" 
				});

				return;
			}

			try {
				sizeOf("files/temp/" + filename, function(err, dimensions) {
					if (err) {
						res.send({ 
							status: consts.ERROR, 
							message: "no_valid_picture" 
						});

						return;

					} else {
						if (!fs.existsSync("files/" + file_hash)) {
							fs.mkdirSync("files/" + file_hash);
						}

						fs.copyFileSync("files/temp/" + filename, filePath);
						fs.unlinkSync("files/temp/" + filename);
					}
					db("UPDATE profile SET avatar=? WHERE user_id=?", [
						filePath,
						user_id
					])
						.then(result => {
							res.send({
								status: consts.SUCCESS,
								message: "image_loaded",
								file: filePath
							});
						})
						.catch(result => {
							res.send({
								status: consts.ERROR,
								message: "image_no_loaded"
							});
						});
				});
				
			} catch (e) {
				res.send({ 
					status: consts.ERROR,
					message: "no_valid_picture" 
				});

				return;
			}
		});
	});

	return {
		app,
		db,
		users
	};
};
