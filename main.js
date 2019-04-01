import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store/store';
import plugin from './plugins/preLoader';
// import Datetime from 'vue-datetime'
// You need a specific loader for CSS files
// import 'vue-datetime/dist/vue-datetime.css'
// import Buefy from 'buefy'
import Notifications from 'vue-notification';
//import 'buefy/dist/buefy.css'
import i18n from './plugins/i18n';
import { deflateRaw } from 'zlib';
Vue.use(Notifications);
Vue.use(plugin);
// Vue.use(Buefy)

Vue.component('Test', {
	props: {
		to: String,
		name: String
	},
	data() {
		return {
			targets: [],
			html: ''
		}
	},
	created() {
		if (this.to) {
			this.targets.push(1);
			console.log('use to');
		} else if (this.name) {
			this.targets.push(2);
			console.log('use name');
		}
		console.log(this.targets);
	},
	render(h) {
		return h('div', null, 'njdjdjdjdjd');
		//console.log(h);
	},
	template: '<div><jdfhjjdk 990-8989</div>'
});


Vue.filter('capitalize', function (value) {
	if (!value) return ''
	value = value.toString()
	return value.charAt(0).toUpperCase() + value.slice(1)
});
Vue.filter('capitalize1', function (value) {
	if (!value) return ''
	let div = ['<div>', '</div>'];
	let str = div[0] + value + div[1];
	return str;
});


Vue.config.productionTip = false
var v = new Vue({
	store,
	router,
	i18n,
	render: h => h(App)
}).$mount('#app')