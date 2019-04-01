<template>
	<v-flex px-3 py-3>
		<v-flex sm4 xs6>
			<v-select
				v-model="defaultPeriod"
				:items="selectPeriod"
				:label="'Период ' +defaultPeriod+ ' дней'"
			></v-select>
		</v-flex>
		<v-flex class="statistic" xs12 sm12>
			<v-radio-group v-model="typeChart" row>
				<v-radio label="Line" value="ChartLine"></v-radio>
				<v-radio label="Bar" value="ChartBar"></v-radio>
				<v-radio label="Radar" value="ChartRadar"></v-radio>
			</v-radio-group>
		</v-flex>
		<v-flex class="charts-comp">
			<component :is="typeChart" :chartData="getChartData"/>
		</v-flex>
	</v-flex>
</template>

<script>
import AbstractStatic from "@/components/statistic/Statistic";
import { mapGetters, mapActions } from "vuex";

export default {
	extends: AbstractStatic,

	name: "Feeding",

	data() {
		return {
			selectPeriod: [5, 10, 15, 20, 25, 30, 60, 90, 180],
			defaultPeriod: 30
		};
	},

	methods: {
		getPeriodEatFeedding(arrDays, period) {
			let labels = [],
				chartEatLength = [],
				chartEatTime = [];

			arrDays.map(el => {
				let current = new Date(el).toLocaleDateString();
				let eventInDay = [];
				let time = 0;

				period.map(el => {
					if (
						current === new Date(el.starttime).toLocaleDateString()
					) {
						eventInDay.push(current);
						time += el.endtime - el.starttime;
					}
				});

				labels.push(...[current]);
				chartEatLength.push(eventInDay.length);
				chartEatTime.push(
					Number((0 | (time / 1000 / 60)) / 60).toFixed(1)
				);
			});

			return {
				labels,
				chartEatLength,
				chartEatTime
			};
		}
		// getPeriodTimeOnFeeding(arrDays, period) {
		// 	let labels = [],
		// 		chartData = [];
		// 	let timeEat = [],
		// 		allTime = [];
		// 	arrDays.map(el => {
		// 		let current = new Date(el).toLocaleDateString();
		// 		let time = 0;
		// 		period.map(el => {
		// 			if (current === new Date(el.starttime).toLocaleDateString()) {
		// 				time += el.endtime - el.starttime;
		// 			}
		// 		});
		// 		arr.push((0 | time / 1000 / 60) / 60);
		// 	});
		// }
	},

	computed: {
		...mapGetters(["FEEDING"]),

		getChartData() {
			let { arrDays, period } = this.greatePeriod(
				this.FEEDING,
				"starttime"
			);

			let {
				labels,
				chartEatLength,
				chartEatTime
			} = this.getPeriodEatFeedding(arrDays, period);

			let data = {
				labels: labels,
				datasets: [
					{
						label: "Количество кормлений",
						backgroundColor: "#f87979",
						data: chartEatLength
					},
					{
						label: "Время кормления ч",
						backgroundColor: "#ff00ff",
						data: chartEatTime
					}
				]
			};

			return data;
		}
	}
};
</script>

<style>
</style>
