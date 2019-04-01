<template>
	<v-dialog v-model="dialog" persistent max-width="500px">
		<v-card>
			<v-card-title>
				<span class="headline">Выход</span>
			</v-card-title>
			<div @click="closeForm()" class="closeform">
				<v-icon>clear</v-icon>
			</div>
			<v-card-text>Вы точно хотите выйти?</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" flat @click.native="logout()">Выйти</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import ADialogAbstract from "@/components/auth/ADialogAbstract.vue";

export default {
	extends: ADialogAbstract,

	name: "Logout",

	data() {
		return {
			dialog: true
		};
	},

	methods: {
		logout() {
			const router = this.$router;

			this.$store.dispatch("logout").then(data => {
				this.$emit("dialogEvent", {
					type: "close"
				});
				this.$notify({
					group: "message",
					type: data.status ? "success" : "error",
					title: data.message
				});

				if (data.status) {
					this.$store.commit("CLEAR_AUTO_UPDATE_DATE");

					if (router.history.current.meta.auth === "member") {
						router.push("/");
					}
				}
			});
		}
	}
};
</script>

<style>
.message {
	color: #333;
}
</style>
