import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';
import Home from './views/Home.vue';
import i18n from './plugins/i18n';

Vue.use(i18n);
Vue.use(Router);

const auth = {
	ALL: 'all',
	GUEST: 'guest',
	MEMBER: 'member'
}

var router = new Router({
	mode: "history",

	routes: [
		{
			path: '*',
			name: '404',
			component: () => import('./views/Page_404.vue'),
			meta: { auth: auth.ALL }
		},
		{
			path: '/',
			name: 'Home',
			component: Home,
			meta: { auth: auth.ALL }
		},
		{
			path: '/blog/:id?',
			name: 'Blog',
			component: () => import('./views/Blog.vue'),
			meta: { auth: auth.ALL },
		},
		{
			path: '/login',
			name: 'Login',
			component: Home,
			meta: { auth: auth.GUEST }
		},
		{
			path: '/logout',
			name: 'Logout',
			component: Home,
			meta: { auth: auth.MEMBER }
		}, {
			path: '/registration',
			name: 'Registration',
			component: Home,
			meta: { auth: auth.GUEST }
		},
		{
			path: '/feeding',
			name: 'Feeding',
			component: () => import('./views/Feeding.vue'),
			meta: { auth: auth.MEMBER }
		},
		{
			path: '/profile',
			name: 'Profile',
			component: () => import('./views/Profile.vue'),
			meta: { auth: auth.MEMBER }
		},
		{
			path: '/weight_and_growth',
			name: 'WeightAndGrowth',
			component: () => import('./views/ChildOptions.vue'),
			meta: { auth: auth.MEMBER }
		}
	]
});

router.beforeEach((to, from, next) => {
	const pageAccess = to.meta.auth;
	const member = store.getters.AUTH;

	store.commit('SAVE_URL', to.path);
	store.getters.MENU.find((el) => {
		if (el.url === to.path) {
			store.commit('SET_LOADER_MENU', el);
		}
	});

	if (!member && ["Login", "Registration"].includes(to.name) || (member && to.name === 'Logout')) {
		store.commit('SET_DIALOG', to.name);

	} else if (localStorage.auth && !store.getters.RELOAD) {
		store.dispatch('reload').then(member => {
			const pageAccess = to.meta.auth;

			if ((member && pageAccess !== auth.GUEST) || (!member && pageAccess !== auth.MEMBER)) {
				next();

			} else {
				next('/');
			}
		});

	} else if ((member && pageAccess !== auth.GUEST) || (!member && pageAccess !== auth.MEMBER)) {
		next();

	} else {
		next('/');
	}

	store.commit('RESET_LOADER_MENU');

});

export default router;