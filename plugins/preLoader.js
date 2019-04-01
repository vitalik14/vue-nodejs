import Vue from 'vue';

let plugin = {};
plugin.install = function (Vue, options) {
	console.log(1);
	// 1. добавление глобального метода или свойства
	Vue.myGlobalMethod = function () {
		console.log(2);
	  // некоторая логика ...
	}
	Vue.prototype.$myMethod = function (methodOptions) {
		console.log(3);
		// некоторая логика ...
	  }
}
export default plugin;