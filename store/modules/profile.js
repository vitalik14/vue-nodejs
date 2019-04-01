const profile = {
	state: {
		profile: {
			name: "",
			gender: "",
			birthday: "",
			avatar: "",
			growth: "",
			weight: ""
		},
	},

	mutations: {
		SET_AVATAR(state, file) {
			state.profile.avatar = file;
		},

		SET_PROFILE(state, data) {
			state.profile.name = data.name;
			state.profile.gender = data.gender;
			state.profile.birthday = data.birthday;
			state.profile.avatar = data.avatar;
			state.profile.growth = data.growth;
			state.profile.weight = data.weight;
		}
	},

	actions: {
		async sendFile({ commit, rootState }, data) {
			let res = await rootState.server.post("/profile_foto", data)
				.catch(response => {
					return {
						status: false,
						message: "Error in upload image"
					};
				})
				.then(response => {
					if (response.data) {
						return response.data;
					}

					return response;
				});

			return res;
		}
	},

	getters: {
		PROFILE: state => state.profile
	}
};

export default profile;