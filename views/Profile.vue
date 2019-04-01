<template>
	<v-container>
		<div class="page">
			<div class="title">
				<h1>{{$t("message.profile")}}</h1>
			</div>
			<div class="content-page page-profile">
				<div class="grid-page">
					<v-card class="card">
						<v-img id="img" :src="SERVER.defaults.baseURL + '/' + PROFILE.avatar" alt height="300px">
							<v-layout column fill-height>
								<v-spacer></v-spacer>
								<v-card-title class="groupe-btns pl-5 pt-5">
									<form id="file-avatar" @submit.prevent="sendFile()">
										<input style="display:none" ref="file" type="file">
									</form>
									<button @click="clickBtnFile($event)" class="white--text v-btn input-file">Загрузить
										<v-icon right dark>cloud_upload</v-icon>
									</button>
									<v-btn
										:loading="loadingFile"
										:disabled="!stepLoad"
										color="#ef7c88"
										class="white--text"
										@click="sendFile()"
									>Сохранить
										<v-icon right dark>cloud_upload</v-icon>
									</v-btn>
								</v-card-title>
							</v-layout>
						</v-img>

						<v-list two-line>
							<v-list-tile @click>
								<v-list-tile-action>
									<v-icon color="#ef7c88">person</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title>{{PROFILE.name}}</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>

							<v-divider inset></v-divider>

							<v-list-tile @click>
								<v-list-tile-action>
									<v-icon color="#ef7c88">wc</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title>{{PROFILE.gender == 1? 'Мужской':'Женский'}}</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>

							<v-divider inset></v-divider>

							<v-list-tile @click>
								<v-list-tile-action>
									<v-icon color="#ef7c88">child_care</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title>{{ new Date(PROFILE.birthday).toLocaleString("ru", {year: 'numeric',month: 'numeric',day: 'numeric'})}} - ({{BIRTHDAY}})</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>

							<v-divider inset></v-divider>

							<v-list-tile @click>
								<v-list-tile-action>
									<v-icon color="#ef7c88">vertical_align_top</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title>{{PROFILE.growth}} см</v-list-tile-title>
									<v-list-tile-sub-title>Текущий</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>

							<v-divider inset></v-divider>

							<v-list-tile @click>
								<v-list-tile-action>
									<v-icon color="#ef7c88">vertical_align_bottom</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title>{{PROFILE.weight}} кг</v-list-tile-title>
									<v-list-tile-sub-title>Текущий</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>
						</v-list>
					</v-card>
				</div>
			</div>
		</div>
	</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "PageProfile",

	data() {
		return {
			// info: "",
			err: "error",
			loadingFile: false,
			stepLoad: false
		};
	},

	methods: {
		clickBtnFile(e) {
			let file = this.$refs.file;
			let profile = this;

			file.addEventListener("change", function _file({ target }) {
				let files = (target || window.event.srcElement).files;

				if (FileReader && files && files.length) {
					let fr = new FileReader();
					
					fr.onload = () =>{
						profile.stepLoad = true;

						document.querySelector(".v-image__image").style.backgroundImage = `url(${fr.result})`;
					};

					fr.readAsDataURL(files[0]);
				}

				this.removeEventListener("change", _file);
			});

			file.click();
		},

		sendFile() {
			let formData = new FormData();
			formData.append("file", this.$refs.file.files[0]);
			this.loadingFile = true;

			this.$store
				.dispatch("sendFile", formData)
				.then(({ status, message }) => {
					this.stepLoad = false;
					this.loadingFile = false;

					if (status) {
						this.$store.commit("SET_AVATAR", data.file);
					}

					this.$notify({
						group: "message",
						type: status ? "success" : "error",
						title: this.$i18n.tc("message." + message)
					});
				});
		}
	},

	computed: {
		...mapGetters(["PROFILE", "BIRTHDAY", "SERVER"])
	}
};
</script>

<style>
.grid-page {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	grid-template-rows: 1fr 1fr;
	grid-row-gap: 10px;
	margin: 10px 20px 0;
}

.card {
	grid-column-start: 2;
}

.groupe-btns .input-file {
	background-color: rgb(239, 124, 136);
	border-color: rgb(239, 124, 136);
}
</style>
