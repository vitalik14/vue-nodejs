<script>

import {
	Radar,
	Bar,
	Line,
	mixins
} from 'vue-chartjs'
const {
	reactiveProp
} = mixins;

let options =  {
	maintainAspectRatio: false
};
let Chart = {
	mixins: [reactiveProp],
	props: ['chartData'],
	mounted() {
		this.renderChart(this.chartData, options);
	}
};

let ChartLine = Object.create(Chart, {
	extends: {
		value: Line
	}
});

let ChartBar = Object.create(Chart, {
	extends: {
		value: Bar
	}
});

let ChartRadar = Object.create(Chart, {
	extends: {
		value: Radar
	}
});

let self = this;
export default {
	ChartBar,
	ChartLine,
	ChartRadar,
	self
}

</script>