<template>
	<div class="add-time">
		<v-card-actions>
			<v-btn
				:disabled="step === 1"
				color="primary"
				depressed
				@click="step--"
			>{{$t("message.start/stop")}}</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				:disabled="step === 2"
				color="primary"
				depressed
				@click="step++"
			>{{$t("message.set_the_time")}}</v-btn>
		</v-card-actions>
		<v-card class="mx-auto" max-width="100%">
			<v-window v-model="step">
				<v-window-item :value="1">
					<div class="chest">
						<span class="chest-title">{{ $t("message.select_breast") }}:</span>
						<section>
							<div class="block">
								<v-radio-group :column="false" v-model="chest" class="groupe-chest">
									<v-radio
										v-for="n in 2"
										:key="n"
										:label='n==1?$t("message.left"):$t("message.right")'
										:value="n"
									></v-radio>
								</v-radio-group>
							</div>
						</section>
					</div>
					<div class="btn-start-stop">
						<v-btn
							:disabled="!this.chest || startTimeBtnLoading"
							@click="startStopTime('start')"
							color="info"
							:class="{'is-loading': startTimeBtnLoading}"
						>{{ $t("message.start") }}</v-btn>
						<v-btn
							:disabled="!startTimeBtnLoading"
							@click="startStopTime('stop')"
							color="info"
							:class="{'is-loading': false}"
						>{{ $t("message.stop") }}</v-btn>
					</div>
					<div v-if="visibleTimer" class="timer">{{dataTimer}}</div>
				</v-window-item>
				<v-window-item :value="2">
					<div class="chest">
						<span class="chest-title">{{ $t("message.select_breast") }}:</span>
						<br>
						<section>
							<div class="block">
								<v-radio-group :column="false" v-model="chest" class="groupe-chest">
									<v-radio
										v-for="n in 2"
										:key="n"
										:label='n==1?$t("message.left"):$t("message.right")'
										:value="n"
									></v-radio>
								</v-radio-group>
							</div>
						</section>
					</div>
					<div class="custom-timer">
						<div class="time">
							<div>
								<v-flex xs11 sm6>
									<v-dialog
										ref="dialogStart"
										v-model="modal1"
										:return-value.sync="startTime"
										persistent
										lazy
										full-width
										width="290px"
									>
										<v-text-field
											slot="activator"
											v-model="startTime"
											:label="$t("message.start")"
											prepend-icon="access_time"
											readonly
										></v-text-field>
										<v-time-picker format="24hr" v-if="modal1" v-model="startTime" full-width>
											<v-spacer></v-spacer>
											<v-btn flat color="primary" @click="modal1 = false">Cancel</v-btn>
											<v-btn flat color="primary" @click="$refs.dialogStart.save(startTime); modal1 = false">OK</v-btn>
										</v-time-picker>
									</v-dialog>
								</v-flex>
							</div>
							<div>
								<v-flex xs11 sm6>
									<v-dialog
										ref="dialogEnd"
										v-model="modal2"
										:return-value.sync="endTime"
										persistent
										lazy
										full-width
										width="290px"
									>
										<v-text-field
											slot="activator"
											v-model="endTime"
											:label="$t("message.completion")"
											prepend-icon="access_time"
											readonly
										></v-text-field>
										<v-time-picker format="24hr" v-if="modal2" v-model="endTime" full-width>
											<v-spacer></v-spacer>
											<v-btn flat color="primary" @click="modal2 = false">Cancel</v-btn>
											<v-btn flat color="primary" @click="$refs.dialogEnd.save(endTime);modal2 = false">OK</v-btn>
										</v-time-picker>
									</v-dialog>
								</v-flex>
							</div>
						</div>
						<div class="btn">
							<v-btn :disabled="btnReset" @click="resetTime()" color="info">{{ $t("message.to_clear") }}</v-btn>
							<v-btn :disabled="btnSave" @click="saveCustomTime()" color="info">{{ $t("message.save") }}</v-btn>
						</div>
					</div>
				</v-window-item>
			</v-window>
			<v-divider></v-divider>
		</v-card>
		<div class="custom-time">
			<Datapicker/>
		</div>
		<Statistic/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Datapicker from "@/components/Datepicker";
import Statistic from "@/components/statistic/Feeding";

export default {
	name: "Feeding",

	components: {
		Datapicker,
		Statistic
	},

	filters: {
		capitalize: function(value) {
			if (!value) return "";

			value = value.toString();
			return value.charAt(0).toUpperCase() + value.slice(1);
		}
	},

	data() {
		return {
			startTime: "00:00",
			endTime: "00:00",
			chest: false,
			timer: 0,
			interval: "",
			dataTimer: "0 м.",
			visibleTimer: false,
			startTimeBtnLoading: false,
			step: 1,
			modal1: false,
			modal2: false,
			menu2: false
		};
	},

	created() {
		this.resetTime();
	},

	methods: {
		...mapActions(["addTime"]),

		startStopTime(type) {
			if (!this.chest) return;

			if (type === "start") {
				this.$store.commit("SET_START_TIME", new Date().getTime());
				this.setTimer();
			} else if (this.startTimeBtnLoading) {
				this.$store
					.dispatch("addTime", {
						chest: this.chest,
						end: new Date().getTime()
					})
					.then(res => {
						if (res.status) {
							this.removeTimer();
							this.chest = false;
						}

						this.$notify({
							group: "message",
							type: res.status ? "success" : "error",
							title: res.message
						});
					});
			}
		},

		saveCustomTime() {
			if (!this.chest) return;

			const selectedDate = this.CUSTOM_DATE;
			const start = new Date(selectedDate).setHours(...this.startTime.split(":"));
			let end = new Date(selectedDate).setHours(...this.endTime.split(":"));

			if (this.startTime > this.endTime) {
				end += 86400000; // + next day // 86400000
			}

			this.$store
				.dispatch("addTime", {
					chest: this.chest,
					start,
					end
				})
				.then(res => {
					if (res.status) {
						debugger;
						this.resetTime();
					}

					this.$notify({
						group: "message",
						type: res.status ? "success" : "error",
						title: res.message
					});
				});
		},

		resetTime() {
			this.startTime = "00:00";
			this.endTime = "00:00";
			this.chest = false;
		},

		setTimer() {
			this.visibleTimer = this.startTimeBtnLoading = true;

			this.interval = setInterval(() => {
				let minutes = Math.floor(
					((Math.abs(new Date(this.GET_START_TIME) - new Date()) / 60) * 1000) /
						1000000
				);

				if (minutes > 59) {
					this.dataTimer =
						Math.floor(minutes / 60) + " ч. " + (minutes % 60) + " м. ";
				} else {
					this.dataTimer = minutes + " м. ";
				}
			}, 60000);
		},

		removeTimer() {
			this.dataTimer = "0 м.";
			this.visibleTimer = false;
			this.startTimeBtnLoading = false;
			this.timer = 0;

			clearInterval(this.interval);
		}
	},

	computed: {
		btnReset() {
			return this.startTime != "00:00" || this.endTime != "00:00" ? false : true;
		},

		btnSave() {
			if (this.startTime === this.endTime || this.chest === false) {
				return true;
			}

			return false;
		},

		...mapGetters(["FEEDING", "CUSTOM_DATE", "GET_START_TIME"]),

		currentTitle() {
			switch (this.step) {
				case 1:
					return this.$i18n.tc("message.start/stop");
				case 2:
					return this.$i18n.tc("message.set_the_time");
				default:
					return this.$i18n.tc("message.start/stop");
			}
		}
	}
};
</script>

<style scoped>
.groupe-chest {
	display: flex;
	padding: 0;
	margin: 0;
	align-items: center;
	justify-content: center;
	margin-top: 1px;
}

.delete {
	color: #f00;
	cursor: pointer;
	font-size: 18px;
	user-select: none;
}

.add-time {
	width: 100%;
	margin: 0 10px 0 0;
	text-align: center;
}

.chest {
	display: block;
	vertical-align: top;
}

.chest-title {
	margin: 0 10px 10px 0;
	font-size: 18px;
	vertical-align: top;
	line-height: 2.5;
}

.btn-start-stop {
	display: flex;
	justify-content: center;
}

.btn-start-stop .v-btn {
	margin: 5px 10px 25px;
	width: 20%;
	min-width: 100px;
	max-width: 250px;
}

.timer {
	font-size: 22px;
	color: #717;
	margin: 15px 0;
}

.custom-time {
	margin-top: 10px;
}

.custom-timer {
	display: flex;
	flex-wrap: wrap;
}

.custom-timer .v-dialog__container {
	width: 100px;
}

.custom-timer > div {
	width: 100%;
	display: flex;
	margin: auto;
	text-align: center;
	justify-content: center;
}

.custom-timer > div .timepicker {
	margin: 0 40px;
}

.custom-timer > .btn {
	margin: 20px 20px;
	display: block;
}

.custom-timer > .btn a {
	margin: 20px 5px;
	display: inline block;
	width: 20%;
	max-width: 250px;
	min-width: 150px;
}
</style>
