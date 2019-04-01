const childOptions = {
	//namespaced: true,
	state: {
		child_options: [],
		customDate: new Date(),
		startTime: "",
		apiLoading: false
	},

	mutations: {
		SET_CHILD_OPTIONS(state, arrOptions) {
			state.child_options = arrOptions.sort((x, y) => {
				if (x.date < y.date) {
					return -1;
				} else if (x.date > y.date) {
					return 1;
				}
			});
		},
		API_CHILD_OPTIONS_LOADING(state, block) {
			state.apiLoading = block;
		}
	},

	actions: {
		async loadChildOptions({ state, rootState, commit }) {
			if (state.child_options.length > 0) {
				return {
					message: "data",
					status: true
				};
			} else if (!state.child_options.apiLoading) {
				commit("API_CHILD_OPTIONS_LOADING", true);

				await rootState.server.post("/child_options")
					.then(response => {
						commit("API_CHILD_OPTIONS_LOADING", false);

						if (response.data.error) {
							commit("SET_AUTH", {
								auth: false
							});
							return {
								message: response.data.error,
								status: false
							};
						}

						commit("SET_CHILD_OPTIONS", response.data);
						return {
							message: "data",
							status: true
						};
					})
					.catch(error => {
						commit("API_CHILD_OPTIONS_LOADING", false);

						return {
							message: error,
							status: false
						};
					});
			}
		},
		async addOption({ dispatch }, item) {
			return await dispatch("childOptionsData", {
				type: "add",
				value: item
			}).then(proxy => proxy);
		},

		async deleteOption({ dispatch }, id) {
			return await dispatch("childOptionsData", {
				type: "delete",
				value: id
			}).then(proxy => proxy);
		},
		async childOptionsData({ state, rootState, commit }, { type, value }) {

			if (!state.child_options.apiLoading) {
				commit("API_CHILD_OPTIONS_LOADING", true);
				return await rootState.server.post("/child_options/" + type, value)
					.then(({ message, status, result }) => {
						let _res = {
							status: false,
							message
						};

						commit("API_CHILD_OPTIONS_LOADING", false);

						if (status) {
							commit("SET_CHILD_OPTIONS", result);
							_res.status = true;
						}

						return _res;
					})
					.catch(error => {
						commit("API_CHILD_OPTIONS_LOADING", false);
						console.log("Ошибка -" + error);

						return {
							status: false,
							message: error
						};
					});
			}
		}
	},

	getters: {
		CHILD_OPTIONS: state => state.child_options || []
	}
};

export default childOptions;
