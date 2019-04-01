import Vue from "vue";
import Vuex from "vuex";
import profile from "./modules/profile.js";
import birthday from "./modules/birthday.js";
import auth from "./modules/auth.js";
import menu from "./modules/menu.js";
import feeding from "./modules/feeding.js";
import posts from "./modules/posts.js";
import childOptions from "./modules/childOptions.js";

import server from "./server.js";

Vue.use(Vuex);

let saveMutations = [
	'SET_DIALOG', 'SET_AUTH', 'SAVE_URL', 'SET_BIRTHDAY'
];





const loadAndSave1 = store => {
	let data;
	//debugger;
	//console.log(4324);
	// if (localStorage['_calendar']) {
	// 	data = JSON.parse(localStorage['_calendar']);
	//	store.dispatch('loadData', 'data');
	// }

	store.subscribe((mutation, state) => {
		console.log(mutation);	
	//state.title = new Date().toString();	
		//console.log(mutation)
		//localStorage['_calendar'] = JSON.stringify(state.dinamic);
	});
};

const loadAndSave = store => {
	let saveState;
	//debugger;
	//console.log(4324);
	 if (localStorage['_newborn_child']) {
		let o = JSON.parse(localStorage['_newborn_child']);

		saveState = JSON.parse(localStorage['_newborn_child']);

		//  }
	//	data = JSON.parse(localStorage['_calendar']);
	//	store.dispatch('loadData', 'data');
	 }

	store.subscribe(function (mutation, state) {
		console.log(mutation);
		console.log(state);
// auth		
	//	state.auth.auth;
		//state.auth.token;
	//	state.auth.saveUrl;
	//	state.auth.dialog;

// birthday
		//autoUpdateDate()
		//state.birthday.dinamicDate
		//state.birthday.activeBirthday
//

		localStorage['_newborn_child'] = JSON.stringify(state);
		// localStorage['_newborn_child']
		// debugger;
	//state.title = new Date().toString();	
		//console.log(mutation)
		//localStorage['_calendar'] = JSON.stringify(state.dinamic);
	}.bind(saveState));
};
export default new Vuex.Store({
	modules: {
		profile,
		birthday,
		auth,
		menu,
		feeding,
		posts,
		childOptions
	},

	plugins: [loadAndSave, server],

	state: {
		server: null
	},

	mutations: {
		SET_SERVER(state, server) {
			state.server = server;
		},

		RESTORE_STATE(state, dataState) {

		}
	},

	actions: {},

	getters: {
		SERVER: state => state.server
	}
});
