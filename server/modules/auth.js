const consts = require("../config/consts");
const md5 = require("js-md5");
const config = require("../config");
const validation = require("../config/fieldsTypeCheck");

module.exports = function (app, db, users) {
	const availableUrlForGuest = ["/login", "/registration", "/posts"];

	app.use((request, response, next) => {
		const member = users.existUser(request.headers.authorization);
		response.auth = consts.GUEST;
		// если api доступен для гостя  // если валидный пользователь
		if (availableUrlForGuest.includes(request.url) || (member && (response.auth = consts.MEMBER))) {
			next();
		} else {
			response.send({
				auth: consts.GUEST,
				status: consts.FAIL,
				error: "Authentication false"
			});
		}
	});
	app.post("/login", (request, response) => {
		const check = validation(request.body, "login");
		if (!check.status) {
			response.send({
				auth: consts.GUEST,
				status: consts.ERROR,
				message: check.result
			});
		} else {
			db(
				"SELECT t1.user, t1.status, t2.user_id, t2.birthday, t2.avatar, t2.`name`, t2.gender, t3.growth, t3.weight FROM user AS t1 INNER JOIN profile AS t2 INNER JOIN child_options AS t3 ON t1.id = t2.user_id and t1.id = t3.user_id where t1.user=? AND t1.hash=? ORDER BY t3.date DESC LIMIT 1",
				[request.body.email, md5(request.body.pass)]
			).then(async res => {
				let user = res.results[0];

				if (res.error || !res.results.length) {
					response.send({
						auth: consts.GUEST,
						status: consts.FAIL,
						message: "Неправильный логин или пароль."
					});
				} else {
					const result = await loadingResources(user.user_id);
					const token = md5(request.body.pass + config.db.salt);
					result.user = users.addUser(token, user);

					response.send({
						auth: consts.MEMBER,
						status: consts.SUCCESS,
						message: "Успешно!",
						token,
						publicToken: result.user.publicToken,
						result
					});
				}
			});
		}
	});

	app.post("/reload", (request, response) => {
		const userId = users.getUserId(request.headers.authorization);
		const userData = users.getUserData(request.headers.authorization);

		(async () => {
			let result = await loadingResources(userId);
			result.user = userData;

			response.send({
				auth: consts.MEMBER,
				status: consts.SUCCESS,
				message: "Data was reloaded",
				result
			});
		})();
	});

	async function loadingResources(id) {
		const timeeat = db("SELECT `id`, `starttime`, `endtime`, `chest` FROM timeeat WHERE user_id =?", [id]);
		//let profile = db("SELECT * FROM profile WHERE user_id =?", [id]);
		const childOptions = db("SELECT `id`, `date`, `weight`, `growth`, `comment` FROM child_options WHERE user_id =?", [id]);

		return await Promise.all([/*profile,*/ timeeat, childOptions]).then(result => {
			return {
				//profile: result[0].results[0],
				timeeat: result[0].results,
				childOptions: result[1].results
			};
		});
	}

	// auth
	// error
	// message ++++++
	// result
	// token ++++++
	// status ++++++

	app.post("/registration", (request, response) => {
		let res = {};
		const check = validation(request.body, "registration");
		//debugger;
		if (!check.status) {
			res.status = consts.ERROR;
			res.message = check.result;
		} else {
			db("SELECT * from user WHERE user=?", [request.body.email])
				.then(result => {
					if (result.results.length) {
						response.send({
							status: consts.FAIL,
							message: "Email used"
						});
					} else {
						let pass = md5(request.body.pass);

						db()
							.then(connection => {
								connection.once("error", function (error) {
									response.send({
										status: consts.FAIL,
										message: error
									});
								});
								connection.beginTransaction(function (error) {
									if (error) {
										connection.emit("error", error);
									} else {
										connection.query(
											"INSERT INTO user SET ?",
											{
												user: request.body.email,
												hash: pass,
												status: 1,
												priority: 1
											},
											function (error, results, fields) {
												if (error) {
													connection.rollback(() => {
														connection.emit("error", error);
													});
												} else {
													let user_id = results.insertId;
													connection.query(
														"INSERT INTO profile SET ?",
														{
															user_id,
															name: request.body.nameChild,
															birthday: request.body.birthday,
															gender: request.body.gender,
															avatar: config.user.defaultAvatarPath
														},
														function (error, results, fields) {
															if (error) {
																connection.rollback(() => {
																	connection.emit("error", error);
																});
															} else {
																connection.query(
																	"INSERT INTO child_options SET ?",
																	{
																		user_id,
																		growth: request.body.growth,
																		weight: request.body.weight,
																		date: request.body.birthday
																	},
																	function (error, results, fields) {
																		if (error) {
																			connection.rollback(() => {
																				connection.emit("error", error);
																			});
																		} else {
																			connection.commit(function (error) {
																				if (error) {
																					connection.rollback(() => {
																						connection.emit("error", error);
																					});
																				} else {
																					connection.end();

																					response.send({
																						status: consts.SUCCESS,
																						message: "Account created!"
																					});
																					console.log("success!");
																				}
																			});
																		}
																	}
																);
															}
														}
													);
												}
											}
										);
									}
								});
							})
							.catch(error => {
								response.send({
									status: consts.ERROR,
									message: error
								});
							});
					}
				})
				.catch(error => {
					response.send({
						status: consts.ERROR,
						message: error
					});
				});
			return;
		}
		response.send(res);
	});

	app.post("/logout", (request, response) => {
		let res = {};

		res.uses = users.deleteUser(request.body.token);

		if (res.uses.length) {
			res.status = consts.SUCCESS;
			res.message = "User left the server";
		} else {
			res.status = consts.FAIL;
			res.message = "User not found";
		}
		//Stream.emit("push", "test", { msg: "admit one", users: "LOGOUT" });
		response.send(res);
	});

	return {
		app,
		db,
		users
	};
};
