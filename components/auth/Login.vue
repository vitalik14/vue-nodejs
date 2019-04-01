<template>
	<v-dialog v-model="dialog" persistent max-width="500px">
		<v-card>
			<v-card-title>
				<span class="headline">{{$t('message.authorization')}}</span>
			</v-card-title>
			<div @click="closeForm()" class="closeform">
				<v-icon>clear</v-icon>
			</div>
			<v-card-text>
				<v-container grid-list-md>
					<v-layout wrap>
						<v-flex xs12>
							<v-text-field
								:error-messages="errorEmail"
								v-model="email"
								:label="$t('message.email')"
								type="email"
								required
							></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-text-field
								:error-messages="errorPassword"
								v-model="pass"
								:label="$t('message.password')"
								type="password"
								required
							></v-text-field>
						</v-flex>
					</v-layout>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" flat @click.native="registration()">{{$t('message.registration')}}</v-btn>
				<v-btn color="blue darken-1" flat @click.native="login()">{{$t('message.login')}}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import md5 from "js-md5";
import ADialogAbstract from "@/components/auth/ADialogAbstract.vue";

export default {
	extends: ADialogAbstract,

	name: "Login",

	data() {
		return {
			dialog: true,
			email: "vitalik1414@gmail.com",
			pass: "12345",
			errorEmail: "",
			errorPassword: ""
		};
	},

	methods: {
		login() {
			const router = this.$router;
			this.errorEmail = this.errorPassword = "";

			if (
				!this.email ||
				this.email.length < 5 ||
				!this.validEmail(this.email)
			) {
				this.errorEmail = "Некорректный email";
			} else if (!this.pass || this.pass.length < 5) {
				this.errorPassword = "Некорректный password";
			} else {
				this.$store
					.dispatch("authentication", {
						email: this.email,
						pass: md5(this.pass)
					})
					.then(data => {
						this.$notify({
							group: "message",
							type: data.status ? "success" : "error",
							title: data.message
						});

						data.status ? this.closeForm() : null;
					});
			}
		},

		registration() {
			this.$emit("dialogEvent", {
				type: "registration"
			});
		}
	}
};
</script>

<style>
</style>
