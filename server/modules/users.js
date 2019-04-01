class Users {
	constructor() {
		this.users = [];
		this.checkInterval = setInterval(this.revealLost, 1000 * 115 * 1, this);
	}

	getUserId(token) {
		const user = this.users.find((el, i) => {
			if (el.token === token) {
				return el.id;
			} else {
				return false;
			}
		});

		if (user) {
			return user.id;
		} else {
			return false;
		}
	}

	getUserData(token) {
		const user = this.users.find((el, i) => {
			if (el.token === token) {
				return el.data;
			} else {
				return false;
			}
		});

		return user.data;
	}

	getUsers() {
		return this.users;
	}

	addUser(token, data) {
		if (this.existUser(token)) return false;
		const id = data.user_id;
		//this.stream = Stream;
		delete (data.user_id);
		data.publicToken = 0 | Math.random() * 1000000000;

		const user = {
			id,
			data,
			token,
			time: new Date().getTime()
		};

		this.users.push(user);

		return user.data;
	}

	deleteUser(token, el) {
		let user;

		if (!el) {
			user = this.users.find((el, i) => {
				if (el.token === token) {
					return true;
				} else {
					return false;
				}
			});
		} else {
			user = el;
		}
		console.log('LOGOUT');
		//this.stream.emit("push", "logout", { message: "user logout", publicToken: user.data.publicToken });

		return this.users.splice(user.index, 1);
	}

	existUser(token) {
		if (
			this.users.find((el, i) => {
				if (el.token == token) {
					return el;
				} else {
					return false;
				}
			})
		)
			return true;
		else return false;
	}

	revealLost(self) {
		self.users.map((el, index, arr) => {
			if (new Date().getTime() - el.time > 1000 * 120 * 1) {
				self.deleteUser(null, el);
			}
		});
	}
}

module.exports = new Users();