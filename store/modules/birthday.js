var moment = require("moment");

const birthday = {
	//namespaced: true,
	state: {
		dinamicDate: "",
		hourDate: "",
		currentInterval: "",
		activeBirthday: false
	},

	mutations: {
		SET_BIRTHDAY(state, date) {
			state.activeBirthday = true;
			state.dinamicDate = date;
		},

		CLEAR_AUTO_UPDATE_DATE(state) {
			clearInterval(state.currentInterval);

			state.currentInterval = null;
			state.activeBirthday = false;
			state.dinamicDate = "";
		}
	},

	actions: {
		autoUpdateDate({ state, commit, rootState }) {

			if (state.currentInterval || state.activeBirthday) {
				return;
			}

			let birthday = moment(new Date(rootState.profile.profile.birthday));
			
			function timeInterval() {
				let currentDate = new moment();
				let duration = moment.duration(currentDate.diff(birthday));
				let y = duration.years();
				let year = y > 4 ? y + " л. " : y > 0 ? y + " г. " : "";
				let month = duration.months() + " м. ";
				let day = duration.days() + " д. ";

				commit("SET_BIRTHDAY", year + month + day);
			}

			timeInterval();
			state.currentInterval = setInterval(timeInterval, 60000);
		}
	},

	getters: {
		BIRTHDAY: (state, getters, rootState) => state.dinamicDate,

		ACTIVE_BIRTHDAY: state => state.activeBirthday,
	}
};

export default birthday;
