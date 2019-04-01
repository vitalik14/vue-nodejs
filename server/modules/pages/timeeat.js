const consts = require("../../config/consts");
const validation = require("../../config/fieldsTypeCheck");

module.exports = function (app, db, users) {
	app.post("/timeeat", (request, response) => {
		const userId = users.getUserId(request.headers.authorization);

		db("SELECT * from timeeat WHERE user_id=?", [userId]).then(result => {
			response.send({
				status: consts.SUCCESS,
				result: result.results
			});
		});
	});

	app.post("/timeeat/add", (request, response) => {
		const userId = users.getUserId(request.headers.authorization);
		const check = validation(request.body, "feedingAdd");

		if (!check.status) {
			response.send({
				status: consts.ERROR,
				message: check.result
			});

		} else {
			db("INSERT INTO timeeat	SET ?", {
				starttime: request.body.start,
				endtime: request.body.end,
				chest: request.body.chest,
				user_id: userId
			})
				.then(result => result.results)
				.then(res => {
					if (res.affectedRows) {
						db("SELECT `id`, `starttime`, `endtime`, `chest` from timeeat WHERE user_id=?", [userId]).then(res => {
							response.send({
								status: consts.SUCCESS,
								message: "Item added",
								result: res.results
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

	app.post("/timeeat/delete", (request, response) => {
		const userId = users.getUserId(request.headers.authorization);
		const id = request.body.id;

		if (userId && id) {
			db("DELETE FROM timeeat WHERE id = ? AND user_id=?", [id, userId])
				.then(result => result.results)
				.then(res => {
					if (res.affectedRows) {
						db("SELECT `id`, `starttime`, `endtime`, `chest` from timeeat WHERE user_id=?", [userId])
							.then(result => {
								response.send({
									status: consts.SUCCESS,
									message: "Item deleted!",
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

