const menu = {
	//namespaced: true,
	state: {
		itemsAll: [
			{
				icon: "bubble_chart",
				title: "home",
				url: "/",
				position: 1,
				visible: true,
				loader: false
			},
			{
				icon: "chrome_reader_mode",
				title: "blog",
				url: "/blog",
				position: 2,
				visible: true,
				loader: false
			}
		],
		itemsGuest: [
			{
				icon: "person_outline",
				title: "login",
				url: "/login",
				position: 4,
				visible: true,
				loader: false
			},
			{
				icon: "person_add",
				title: "registration",
				url: "/registration",
				position: 5,
				visible: false,
				loader: false
			}
		],
		itemsAuth: [
			{
				icon: "directions_run",
				title: "logout",
				url: "/logout",
				position: 4,
				visible: true,
				loader: false
			},
			{
				icon: "alarm_add",
				title: "feeding",
				url: "/feeding",
				position: 2,
				visible: true,
				loader: false
			},
			{
				icon: "alarm_add",
				title: "weight_and_growth",
				url: "/weight_and_growth",
				position: 2,
				visible: true,
				loader: false
			},
			{
				icon: "perm_identity",
				title: "profile",
				url: "/profile",
				position: 2,
				visible: true,
				loader: false
			}
		]
	},

	mutations: {
		SET_LOADER_MENU(state, path) {
			path.loader = true;
		},

		RESET_LOADER_MENU({ itemsAll, itemsAuth }) {
			[itemsAll, itemsAuth].map(el =>
				el.map(el => {
					el.loader = false;
				})
			);
		}
	},

	actions: {},

	getters: {
		MENU: ({ itemsAll, itemsAuth, itemsGuest }, { AUTH }) => {
			let menu = Array.from(itemsAll);

			if (AUTH) {
				menu.push(...itemsAuth);
			} else {
				menu.push(...itemsGuest);
			}

			for (let i = 0, length = menu.length; i < length; i++) {
				for (let n = i + 1; n < length; n++) {
					if (menu[i].position > menu[n].position) {
						[menu[i], menu[n]] = [menu[n], menu[i]];
					}
				}
			}

			return menu;
		}
	}
};

export default menu;