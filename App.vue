<template>
	<v-app>
		<v-navigation-drawer persistent :clipped-left="clipped" v-model="drawer" fixed app>
			<v-list>
				<router-link
					:to="item.url"
					tag="v-list-tile"
					value="true"
					v-for="(item, i) in MENU"
					:key="i"
					v-if="item.visible"
				>
					<v-list-tile-action>
						<v-icon v-html="item.icon"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>
							{{$t("message."+ item.title)}} &nbsp;
							<v-progress-circular v-if="item.loader" indeterminate :size="20" color="primary"></v-progress-circular>
						</v-list-tile-title>
					</v-list-tile-content>
				</router-link>
			</v-list>
		</v-navigation-drawer>

		<v-toolbar app :clipped-left="clipped" class="s-theme" dark color="primary">
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title class="white--text" v-if="AUTH">{{PROFILE.name}} - {{BIRTHDAY}}</v-toolbar-title>
			<v-toolbar-title class="white--text" v-if="USERS"> {{USERS}} </v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon v-if="AUTH">
				<router-link class="icon-menu" to="/profile">
					<v-icon>perm_identity</v-icon>
				</router-link>
			</v-btn>
			<v-btn icon v-if="AUTH">
				<router-link class="icon-menu" to="/feeding">
					<v-icon>alarm_add</v-icon>
				</router-link>
			</v-btn>
			<v-btn icon v-if="AUTH">
				<a class="icon-menu" @click="$store.commit('SET_DIALOG', 'Logout');">
					<v-icon>directions_run</v-icon>
				</a>
			</v-btn>
			<v-btn icon v-else>
				<a class="icon-menu" @click="$store.commit('SET_DIALOG', 'Login');">
					<v-icon>person_outline</v-icon>
				</a>
			</v-btn>
			<div class="lang" @click="changeLanguages()">
				<transition name="lang" appear mode="out-in">
					<div v-if="lng" class="en" key="en"></div>
					<div v-else class="ru" key="ru"></div>
				</transition>
			</div>
		</v-toolbar>
		<v-content>
			<router-view/>
			<ADialog/>
		</v-content>
		<v-footer :fixed="fixed" app>
			<span>&copy; {{new Date().getFullYear()}}</span>
		</v-footer>
		<notifications group="message" position="bottom left" :speed="1000"/>
	</v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ADialog from "@/components/auth/ADialog";

export default {
	name: "App",

	components: {
		ADialog
	},

	data() {
		return {
			clipped: false,
			drawer: false,
			fixed: false,
			lng: false
		};
	},
	beforeDestroy() {
		debugger;
	},
	methods: {
		changeLanguages() {
			this.lng = !this.lng;
			this.$i18n.locale = this.lng ? "en" : "ru";
		}
	},

	computed: {
		...mapGetters(["AUTH", "BIRTHDAY", "PROFILE", "MENU", "DIALOG", "USERS"]),

		router() {
			let rout = this.$router;

			if (!rout.history.pending) {
				return {
					_auth: 1
				};
			}
			return rout.options.routes.find(el => {
				if (el.name === rout.history.pending.name) {
					return true;
				}
			});
		}
	}
};
</script>

<style>
#app {
	background: url(./assets/fon1.jpg) repeat;
	background-clip: content-box;
}

.content-page.fon {
	background: #d1d6ec;
	border-radius: 10px;
	padding: 10px;
	box-shadow: 0 0 15px #0b0202;
	margin-top: 10px;
}

.no-underline {
	text-decoration: none;
}

.no-underline * {
	text-decoration: none;
}

h2 {
	color: rgb(70, 126, 238);
}

.home {
	margin: 0;
}

.icon-menu {
	color: #fff;
}

.lang {
	width: 35px;
	height: 24px;
	cursor: pointer;
	overflow: hidden;
	border: 1px solid #fef;
}

.menu-left {
	padding-left: 300px;
}

.en,
.ru {
	width: 33px;
	height: 22px;
}

.en {
	background: url(./assets/en.png) no-repeat 0 0;
}

.ru {
	background: url(./assets/ru.png) no-repeat 0 0;
}

.lang-enter-active,
.lang-fade-leave-active {
	transition: opacity 0.2s ease;
}

.lang-enter,
.lang-leave-to {
	opacity: 0;
}

.page .title {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
	margin-left: 25px;
}



.page .title h1 {
	color: #070200;
	font-size: 16px;
	background: #ffffff;
	padding: 10px 20px;
	box-shadow: 0 6px 13px #1d101080;
	border-radius: 5px;
}

.s-theme a {
	text-decoration: none;
}
</style>