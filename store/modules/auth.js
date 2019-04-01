const auth = {
	//namespaced: true,
	state: {
		auth: localStorage.getItem("auth") === "member" ? true : false,
		token: localStorage.getItem("token") || "",
		publicToken: null,
		block: false,
		registration: false,
		dialog: null,
		saveUrl: "",
		reload: false,
		users: ""
	},

	mutations: {
		SAVE_URL(state, url) {
			if (!["/login", "/registration", "/logout"].includes(url)) {
				state.saveUrl = url;
			}
		},

		SET_DIALOG(state, dialog) {
			state.dialog = dialog;
		},

		SET_USERS(state, users) {
			state.users = users;
		},

		LOGOUT(state) {
			state.auth = false;
			state.publicToken = null;
			localStorage.setItem("auth", "guest");
		},

		SET_AUTH(state, data) {
			state.reload = true;
			if (!data) return;
			state.auth = data.auth;
			state.publicToken = data.result.user.publicToken;
			localStorage.setItem("auth", data.auth ? "member" : "guest");
		}
	},

	actions: {
		async reload({ state, rootState, commit, dispatch }) {
			return await rootState.server
				.post("/reload")
				.then(res => {
					if (res.auth) {
						commit("SET_AUTH", res);
						commit("SET_PROFILE", res.result.user);
						commit("SET_CHILD_OPTIONS", res.result.childOptions);
						commit("SET_FEEDING", res.result.timeeat);
						dispatch("autoUpdateDate");
					} else if (state.auth) {
						commit("SET_AUTH", { auth: false });
					}

					return res.auth;
				})
				.catch(error => {
					console.log(error);
				});
		},

		async authentication({ state, commit, dispatch, rootState }, data) {
			// data = {email, pass}
			return await rootState.server.post("/login", data).then(res => {
				if (res.auth) {
					let token = (state.token = res.token || state.token);

					rootState.server.defaults.headers.common["Authorization"] = token;
					localStorage.setItem("token", token);
					commit("SET_PROFILE", res.result.user);
					commit("SET_CHILD_OPTIONS", res.result.childOptions);
					commit("SET_FEEDING", res.result.timeeat);
					dispatch("autoUpdateDate");
				}

				commit("SET_AUTH", res);
				return res;
			});
		},

		async registration({ rootState }, data) {
			return await rootState.server.post("/registration", data);
		},

		async logout({ state, rootState, commit }) {
			return await rootState.server.post("/logout", { token: state.token }).then(res => {
				if (res.status) {
					commit("LOGOUT");
				}

				return res;
			});
		}
	},

	getters: {
		AUTH: state => state.auth,

		RELOAD: state => state.reload,

		REG: state => state.registration,

		DIALOG: state => state.dialog,

		GET_URL: state => state.saveUrl,

		USERS: state => state.users,

		PUBLIC_TOKEN: state => state.publicToken,
	}
};

export default auth;
