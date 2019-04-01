import axios from "axios";

const server = store => {
	let server = axios.create({
		//serverUrl: 'http://server.vitalik14.pw:80',
		baseURL: "http://localhost:3004"
	});
	server.defaults.headers.common["Authorization"] = localStorage.getItem("token") || "";

	store.commit('SET_SERVER', server);
	store.state.server.interceptors.response.use(
		function (response) {
			let server = response.data;
			let auth = server.auth;
			let status = server.status;
			//store.dispatch('loadTiming');


			if (server.auth === "guest" && server.error) {
				this.commit("LOGOUT");
				this.commit('SET_DIALOG', 'Login');
				return {
					status: false,
					message: 'User is Guest'
				}

			} else {
				if (auth) {
					server.auth = auth === "member" ? true : false;
				}
				if (status) {
					server.status = status === "success" ? true : false;
				}

				return server;
			}




		}.bind(store)
	);
};
export default server;