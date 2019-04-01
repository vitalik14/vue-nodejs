<template>
	<v-dialog v-model="dialog" persistent max-width="500px">
		<v-card>
			<v-card-title>
				<span class="headline">{{$t('message.registration')}}</span>
			</v-card-title>
			<div @click="closeForm()" class="closeform">
				<v-icon>clear</v-icon>
			</div>
			<v-card-text>
				<v-container grid-list-md>
					<v-layout wrap>
						<v-flex xs12>
							<v-text-field
								:error-messages="form.error.Email"
								v-model="form.fields.email"
								:label="$t('message.email')"
								type="email"
								required
							></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-text-field
								:error-messages="form.error.password"
								v-model="form.fields.pass"
								:label="$t('message.password')"
								type="password"
								required
							></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-text-field
								:error-messages="form.error.repeatPassword"
								v-model="form.fields.passRepeat"
								:label="$t('message.repeatPassword')"
								type="password"
								required
							></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-text-field
								:error-messages="form.error.nameChild"
								v-model="form.fields.nameChild"
								:label="$t('message.nameChild')"
								type="text"
								required
							></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-select
								v-model="form.fields.gender"
								:error-messages="form.error.gender"
								item-value="1"
								:items="genderItems"
								:label="$t('message.gender')"
								solo
								required
							></v-select>
						</v-flex>

						<v-flex xs12>
							<div class="datapicker-wrap">
								<v-flex justify-center>
									<v-menu
										class="menu-date-input-reg"
										:close-on-content-click="false"
										v-model="menu"
										:nudge-right="40"
										lazy
										transition="scale-transition"
										offset-y
										min-width="290px"
									>
										<v-text-field
											slot="activator"
											:error-messages="form.error.birthday"
											v-model="form.fields.date"
											:label="$t('message.birthdayChild')"
											prepend-icon="event"
											readonly
										></v-text-field>
										<v-date-picker
											v-model="form.fields.date"
											:max="new Date().toISOString()"
											event-color="green lighten-1"
											@input="menu = false"
										></v-date-picker>
									</v-menu>
								</v-flex>
							</div>
						</v-flex>
						<v-flex xs12>
							<v-text-field
								:error-messages="form.error.growth"
								v-model="form.fields.growth"
								label="Рост"
								type="Number"
								suffix="см"
								required
							></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-text-field
								:error-messages="form.error.weight"
								v-model="form.fields.weight"
								label="Вес"
								type="Number"
								suffix="кг"
								required
							></v-text-field>
						</v-flex>
						<v-flex xs12>
							<vue-recaptcha
								ref="captcha"
								@expired="expired()"
								@verify="verify()"
								sitekey="6Lfv8XQUAAAAAJ6uF6O7mCee6-5vSjlsTVUmxxIU"
							></vue-recaptcha>
							<!-- <vue-recaptcha ref="captcha" @expired="expired()" @verify="verify()" sitekey="6LdyfnQUAAAAALKUqmD62tq5zGf-K6IAJ-1sxlWR"></vue-recaptcha> -->
							<div v-if="captcha" class="error">Потвердите что вы не бот :)</div>
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
import VueRecaptcha from "vue-recaptcha";
import ADialogAbstract from "@/components/auth/ADialogAbstract.vue";
import md5 from "js-md5";

export default {
	extends: ADialogAbstract,
	name: "Registration",

	components: {
		VueRecaptcha
	},

	form: {
		fields: {
			email: "asdad@gh.ty",
			pass: "1234567",
			passRepeat: "1234567",
			nameChild: "asdasdasd",
			gender: "",
			date: "",
			growth: "123",
			weight: "123"
		},
		error: {
			email: "",
			password: "",
			repeatPassword: "",
			nameChild: "",
			gender: "",
			birthday: "",
			growth: "",
			weight: ""
		}
	},

	data() {
		return {
			dialog: true,
			i18n: null,
			form: null,
			genderItems: [],
			captchaVerify: false,
			captcha: false,
			menu: false,
			infoClass: ""
		};
	},

	created() {
		this.i18n = this.$i18n.messages[this.$i18n.locale].message;
		this.genderItems.push(this.i18n["man"], this.i18n["woman"]);
		this.form = this.$options.form;
	},

	methods: {
		verify() {
			this.captchaVerify = true;
			this.captcha = false;
		},

		expired() {
			this.captchaVerify = false;
			this.captcha = true;
		},

		registration() {
			this.captcha = false;

			for (let prop in this.form.error) {
				this.form.error[prop] = null;
			}

			if (
				!this.form.fields.email ||
				this.form.fields.email.length < 5 ||
				!this.validEmail(this.form.fields.email)
			) {
				this.form.error.email = "Не корректный email";
			} else if (
				!this.form.fields.pass ||
				this.form.fields.pass.length < 5 ||
				this.form.fields.pass.length > 33
			) {
				this.form.error.password = "Некорректный password";
			} else if (
				!this.form.fields.passRepeat ||
				this.form.fields.passRepeat.length < 5 ||
				this.form.fields.passRepeat !== this.form.fields.pass
			) {
				this.form.error.repeatPassword = "Пароли не совпадают";
			} else if (
				!this.form.fields.nameChild ||
				this.form.fields.nameChild > 14
			) {
				this.form.error.nameChild =
					"Поле имя ребенка не должно быть пустым и не больше 14 символов";
			} else if (!this.form.fields.gender) {
				this.form.error.gender = "Выбирите пол ребенка";
			} else if (
				!this.form.fields.growth &&
				typeof this.form.fields.growth !== "number"
			) {
				this.form.error.growth = "Введите рост ребенка";
			} else if (
				!this.form.fields.date &&
				typeof this.form.fields.date !== "number"
			) {
				this.form.error.birthday = "Введите день рождения ребенка";
			} else if (
				!this.form.fields.weight &&
				typeof this.form.fields.growth !== "number"
			) {
				this.form.error.weight = "Введите вес ребенка";
			} else if (false && !this.captchaVerify) {
				this.captcha = true;
			} else {
				this.form.fields.birthday = String(
					new Date(this.form.fields.date).getTime()
				);
				this.form.fields.gender =
					this.form.fields.gender === this.i18n["man"] ? 1 : 2;

				delete this.form.fields.passRepeat;
				delete this.form.fields.date;

				this.$store
					.dispatch("registration", this.form.fields)
					.then(data => {
						if (data.status) {
							for (let prop in this.form.fields) {
								this.form.fields[prop] = "";
							}

							this.$refs.captcha.reset();
							this.captchaVerify = false;
							this.login();
						}

						this.$notify({
							group: "message",
							type: data.status ? "success" : "error",
							title: data.message,
							text: data.status
								? "Теперь вы можете зайти под своим логином и паролем!"
								: "Ошибка регистрации"
						});
					});
			}
		},

		login() {
			this.$emit("dialogEvent", {
				type: "login"
			});
		}
	}
};
</script>
<style scoped>
.menu-date-input-reg {
	width: 100%;
}
</style>

