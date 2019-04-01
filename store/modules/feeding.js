const feeding = {
	//namespaced: true,
	state: {
		feeding: [],
		customDate: new Date(),
		// time: {
		// 	startTime: '',
		// 	endTime: '',

		// }
		startTime: "",

		apiLoading: false
	},

	mutations: {
		SET_FEEDING(state, data) {
			state.feeding = data;
		},

		SET_FILTER_CUSTOM_DATE(state, data) {
			state.customDate = data;
		},

		SET_START_TIME(state, time) {
			state.startTime = new Date().getTime();
		},

		API_FEEDING_LOADING(state, block) {
			state.apiLoading = block;
		}
	},

	actions: {
		async loadTiming({ state, rootState, commit }) {
			if (state.feeding.length > 0) {
				return {
					status: true,
					message: "data"
				};

			} else {
				return await dispatch('childFeedingData', {
					type: '',
					value: data
				}).then(proxy => proxy)
			}
		},

		async addTime({ state, dispatch }, data) {
			if (!data.hasOwnProperty("start")) {
				data = Object.assign(data, { start: state.startTime });
			}

			return await dispatch('childFeedingData', {
				type: 'add',
				value: data
			}).then(proxy => proxy)

		},

		async deleteTime({ dispatch }, id) {
			return await dispatch('childFeedingData', {
				type: 'delete',
				value: id
			}).then(proxy => proxy)
		},

		async childFeedingData({ state, rootState, commit }, { type, value }) {

			if (!state.apiLoading) {
				commit("API_FEEDING_LOADING", true);

				return await rootState.server.post("/timeeat/" + type, value)
					.then(({ message, status, result }) => {
						let _res = {
							status: false,
							message
						};

						commit("API_FEEDING_LOADING", false);

						if (status) {
							commit("SET_FEEDING", result);
							_res.status = true;
						}

						return _res;

					})
					.catch(error => {
						commit("API_FEEDING_LOADING", false);
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
		FEEDING: state => state.feeding || [],

		CUSTOM_DATE: state => state.customDate,

		GET_START_TIME: state => state.startTime
	}
};

export default feeding;