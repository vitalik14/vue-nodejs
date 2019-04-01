const posts = {
	//namespaced: true,
	state: {
		posts: [],
		apiLoaded: false
	},

	mutations: {
		SET_POSTS(state, data) {
			data.forEach(el => {
				el.opened = false;
			});

			state.posts = data;
		},

		API_LOAD(state, block) {
			state.apiLoaded = block;
		}
	},

	actions: {
		async loadPosts({ commit, rootState }) {
			if (this.state.posts.posts.length > 0) {
				return {
					message: this.getters.POSTS,
					status: true
				};
			} else if (!this.state.apiLoaded) {
				commit("API_LOAD", true);

				return await rootState.server
					.post("/posts")
					.then(res => {
						commit("API_LOAD", false);

						if (res.error) {
							return {
								message: [],
								status: false
							};
						}
						//console.log(res);

						commit("SET_POSTS", res);
						return {
							message: res,
							status: true
						};
					})
					.catch(error => {
						commit("API_LOAD", false);

						return {
							message: [],
							status: error
						};
					});
			}
		}
		// async addPost({ commit }, data) {
		// 	if (!this.state.feeding.apiLoaded) {
		// 		commit('API_LOAD', true);
		// 		if (!data.hasOwnProperty('start')) {
		// 			data = Object.assign(data, {start: this.state.feeding.startTime})
		// 		}
		// 		console.log(data);
		// 		return await this.getters.SERVER.post("/addpost", data)
		// 		.then(response => {
		// 			commit('API_LOAD', false);
		// 			console.log(data);
		// 			if (response.data.auth) {
		// 				commit('SET_DIALOG', 'Login')
		// 				return false;
		// 			} else {
		// 				commit("SET_FEEDING", response.data.data);
		// 				return true;
		// 			}
		// 		}).catch((el) => {
		// 			commit('API_LOAD', false);
		// 			console.log('Ошибка -'+ el)
		// 			return false;
		// 		});
		// 	}
		// },
		// async deletePosts({ commit }, data) {
		// 	if (!this.state.feeding.apiLoaded) {
		// 		commit('API_LOAD', true);
		// 		return await this.getters.SERVER.post("/deletepost", data)
		// 		.then(response => {
		// 			commit('API_LOAD', false);
		// 			if (response.data.user === 'guest') {
		// 				commit('SET_DIALOG', 'Login');
		// 				return false;
		// 			} else {
		// 				commit("SET_FEEDING", response.data.data);
		// 				return true;
		// 			}
		// 		}).catch((el) => {
		// 			commit('API_LOAD', false);
		// 			console.log('Ошибка -'+ el)
		// 			return false;
		// 		});
		// 	}
		// },
		// async editPosts({ commit }, data) {
		// 	if (!this.state.feeding.apiLoaded) {
		// 		commit('API_LOAD', true);
		// 		return await this.getters.SERVER.post("/editpost", data)
		// 		.then(response => {
		// 			commit('API_LOAD', false);
		// 			if (response.data.user === 'guest') {
		// 				commit('SET_DIALOG', 'Login');
		// 				return false;
		// 			} else {
		// 				commit("SET_FEEDING", response.data.data);
		// 				return true;
		// 			}
		// 		}).catch((el) => {
		// 			commit('API_LOAD', false);
		// 			console.log('Ошибка -'+ el)
		// 			return false;
		// 		});
		// 	}
		// }
	},
	getters: {
		POSTS: state => state.posts || []
	}
};

export default posts;
