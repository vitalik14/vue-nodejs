const consts = require("../../config/consts");
const validation = require("../../config/fieldsTypeCheck");
module.exports = function(app, db, users) {
	app.post("/child_options", (request, response) => {
		let userId = users.getUserId(request.headers.authorization);

		db("SELECT * from child_options WHERE user_id=?", [userId]).then(result => {
			response.send({
				status: consts.SUCCESS,
				result: result.results
			});
		});
	});

	app.post("/child_options/add", (request, response) => {
		let userId = users.getUserId(request.headers.authorization);
		let check = validation(request.body, "childOptionsAdd");

		if (!check.status) {
			response.send({
				status: consts.ERROR,
				message: check.result
			});

		} else {
			db("INSERT INTO child_options SET ?", {
				date: request.body.date,
				weight: request.body.weight,
				growth: request.body.growth,
				comment: request.body.comment,
				user_id: userId
			})
				.then(result => result.results)
				.then(res => {
					if (res.affectedRows) {
						db("SELECT `id`, `date`, `weight`, `growth`, `comment` from child_options WHERE user_id=?", [userId]).then(result => {
							response.send({
								status: consts.SUCCESS,
								result: result.results,
								message: "Item added",
							});
						});
					} else {
						response.send({
							status: consts.ERROR,
							message: "Item not added",
							result: []
						});
					}
				});
		}
	});
	app.post("/child_options/delete", (request, response) => {
		let userId = users.getUserId(request.headers.authorization);
		let id = request.body.id;

		if (userId && id) {
			db("DELETE FROM child_options WHERE id = ? AND user_id=?", [id, userId])
				.then(result => result.results)
				.then(res => {
					if (res.affectedRows) {
						db("SELECT `id`, `date`, `weight`, `growth`, `comment` from child_options WHERE user_id=?", [userId]).then(result => {
							response.send({
								status: consts.SUCCESS,
								message: 'Item deleted!',
								result: result.results
							});
						});
					} else {
						response.send({
							status: consts.ERROR,
							message: "Item not deleted",
							result: []
						});
					}
				});
		} else {
			response.send({
				status: consts.ERROR,
				message: "Error userId or id",
				result: []
			});
		}
	});

	return {
		app,
		db,
		users
	};
};
