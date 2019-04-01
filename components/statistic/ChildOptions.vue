<template>
	<v-flex px-3 py-3>
		<v-flex sm4 xs6>
			<div class="pb-4">Статистика</div>
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
			<v-switch v-model="typePoint" label="Point line" color="#ef7c88" :value="false" hide-details></v-switch>
		</v-flex>
		<v-flex class="statistic" xs12 sm12></v-flex>
		<v-flex class="charts-comp">
			<component :is="typeChart" :chartData="getChartData"/>
		</v-flex>
	</v-flex>
</template>
<script>
const day = 86400000; //one day in time

import AbstractStatic from "@/components/statistic/Statistic";
import { mapGetters, mapActions } from "vuex";

export default {
	extends: AbstractStatic,

	name: "ChildOptions",

	data() {
		return {
			selectPeriod: [5, 10, 15, 20, 25, 30, 90, 180],
			defaultPeriod: 180,
			typePoint: false
		};
	},

	methods: {
		getItems() {
			return {
				labels: [],
				data: [
					{
						label: "Рост, см",
						backgroundColor: "#f87979AA",
						field: "growth",
						lastValue: 0,
						lastDate: 0,
						countDayEmpty: 0,
						data: []
					},
					{
						label: "Вес, кг",
						backgroundColor: "#ff00ffAA",
						field: "weight",
						lastValue: 0,
						lastDate: 0,
						countDayEmpty: 0,
						data: []
					}
				]
			};
		},

		setChildOptionsInCalendar(arrDays, period) {
			let labels = [];
			let chartsData = [];
			const childOptions = this.getItems();

			arrDays.map(el => {
				let current = new Date(el).toLocaleDateString();
				let eventData = period.find(item => {
					if (current === new Date(item.date).toLocaleDateString()) {
						return item;
					}
				});

				if (eventData) {
					for (let option of childOptions.data) {
						if (eventData[option.field]) {
							if (option.lastDate !== 0 && this.typePoint) {
								let partField =
									(eventData[option.field] -
										option.lastValue) /
									option.countDayEmpty;

								for (
									let i = 1;
									i <= option.countDayEmpty;
									i++
								) {
									let date = new Date(
										option.lastDate + i * day
									).toLocaleDateString();
									let currentDataValue =
										option.lastValue + partField * i;

									if (!labels.includes(date)) {
										labels.push(date);
									}

									option.data.push(
										currentDataValue.toPrecision(4)
									);
								}
							}

							if (!labels.includes(current)) {
								labels.push(current);
							}

							option.countDayEmpty = 0;
							option.lastDate = eventData.date;
							option.lastValue = eventData[option.field];
							option.data.push(option.lastValue);
						} else {
							option.countDayEmpty += 1;
						}
					}
				} else {
					for (let option of childOptions.data) {
						option.countDayEmpty += 1;
					}
				}
			});

			return {
				labels,
				chartsData: childOptions.data
			};
		}
	},

	computed: {
		...mapGetters(["CHILD_OPTIONS"]),

		getChartData() {
			let { arrDays, period } = this.greatePeriod(
				this.CHILD_OPTIONS,
				"date"
			);

			let { labels, chartsData } = this.setChildOptionsInCalendar(
				arrDays,
				period
			);

			let data = {
				labels: labels,
				datasets: chartsData
			};

			return data;
		}
	}
};
</script>

<style>
</style>