module.exports = function(app, db, users) {
	app.post("/posts", (request, response) => {
		db("SELECT t1.*, t2.* FROM profile AS t1 INNER JOIN posts AS t2 ON t1.user_id = t2.user_id where status=1")
			.then(result => {
				let res = [];
				if (result.results.length) {
					for (let item of result.results) {
						let buf = {};

						buf.id = item.id;
						buf.created = item.created;
						buf.title = item.title;
						buf.short_text = item.short_text;
						buf.long_text = item.long_text;
						buf.name = item.name;
						buf.gender = item.gender;
						buf.birthday = item.birthday;
						buf.avatar = item.avatar;
						buf.type = item.type;
						res.push(buf);
					}

					res.message = "Успешно!";
				}
				response.send(res);
			});
	});
	return {
		app,
		db,
		users
	};
};
