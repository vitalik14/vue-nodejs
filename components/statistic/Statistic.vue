<template>
<v-flex px-3 py-3>
	<v-flex sm4 xs6>
		<v-select v-model="defaultPeriod" :items="selectPeriod" :label="'Период ' +defaultPeriod+ ' дней'"></v-select>
	</v-flex>
	<v-flex class="statistic" xs12 sm12>
		<v-radio-group v-model="typeChart" row>
			<v-radio label="Line" value="ChartLine"></v-radio>
			<v-radio label="Bar" value="ChartBar"></v-radio>
			<v-radio label="Radar" value="ChartRadar"></v-radio>
		</v-radio-group>
		<v-switch v-model="typePoint" label="Point line" color="#ef7c88" :value="false" hide-details></v-switch>
	</v-flex>
	<v-flex class="statistic" xs12 sm12>

	</v-flex>
	<v-flex class="charts-comp">
		<component :is="typeChart" :chartData="getChartData" />
	</v-flex>
</v-flex>
</template>

<script>
import lineChart from '@/plugins/Charts'
import {
	mapGetters,
	mapActions
} from 'vuex';

const day = 86400000; //one day in time

export default {
	name: 'A_Statistic',

	data() {
		return {
			selectPeriod: [5, 10, 15, 20, 25, 30],
			defaultPeriod: 30,
			typeChart: 'ChartLine'
		}
	},

	components: {
		ChartLine: lineChart.ChartLine,
		ChartBar: lineChart.ChartBar,
		ChartRadar: lineChart.ChartRadar
	},

	methods: {
		greatePeriod(source = [], fieldForFilter) {
			let period, minDate, currentDay = new Date();
			let arrDays = [currentDay];

			for (let i = 0; i < this.defaultPeriod; i++) {
				currentDay = new Date(currentDay).getTime() - day;
				arrDays.push(currentDay);
				
			}

			minDate = new Date(arrDays[arrDays.length - 1]).getTime();

			period = source.filter(el => {
				if (el[fieldForFilter] >= minDate) {
					return true;
				}
			});

			arrDays.reverse();

			return {
				arrDays,
				period
			};
		}
	}
}
</script>

<style>
.statistic .v-radio {
	margin-right: 8px;
}

.charts-comp {
	width: auto
}

.wrap-statistic .v-input {
	justify-content: center;
}
</style>
