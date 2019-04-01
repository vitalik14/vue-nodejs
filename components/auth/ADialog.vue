<template>
	<div>
		<component :is="compDialog" @dialogEvent="dialogEvent($event)"/>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Login from "@/components/auth/Login";
import Registration from "@/components/auth/Registration";
import Logout from "@/components/auth/Logout";

export default {
	name: "ADialog",

	components: {
		Login,
		Registration,
		Logout
	},

	data() {
		return {
			compDialog: ""
		};
	},

	created() {
		this.openDialog(this.DIALOG);
	},

	watch: {
		DIALOG() {
			this.openDialog(this.DIALOG);
		}
	},

	computed: {
		...mapGetters(["DIALOG", "AUTH"])
	},

	methods: {
		...mapMutations(["SET_DIALOG"]),

		openDialog(dialogName) {
			this.compDialog = dialogName;
		},

		dialogEvent({ type }) {
			switch (type) {
				case "registration":
					this.SET_DIALOG("Registration");
					break;
				case "login":
					this.SET_DIALOG("Login");
					break;
				case "close":
					this.$nextTick(() => {
						this.SET_DIALOG("");
					});

					if (
						!this.AUTH &&
						this.$router.history.current.meta.auth === "member"
					) {
						this.$router.replace("/");
					}
				default:
					"close";
			}
		}
	}
};
</script>

<style>
</style>
