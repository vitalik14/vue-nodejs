<template>
	<div class="datapicker-wrap">
		<v-flex justify-center>
			<v-menu
				class="menu-date-input"
				:close-on-content-click="false"
				v-model="menu"
				:nudge-right="40"
				lazy
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<v-text-field slot="activator" v-model="date" label="Set date" prepend-icon="event" readonly></v-text-field>
				<v-date-picker
					v-model="date"
					:events="eventsInDatapicker"
					:max="new Date().toISOString()"
					event-color="green lighten-1"
					@input="change(date)"
				></v-date-picker>
			</v-menu>
		</v-flex>
		<TableT :data="filteredDate"/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableT from "@/components/Table";

export default {
	name: "Datepicker",

	components: {
		TableT
	},

	props: {
		items: Array,
		customDate: String
	},

	data() {
		return {
			date: new Date().toISOString().substr(0, 10),
			menu: false
		};
	},

	methods: {
		change(date) {
			this.menu = false;
			this.$store.commit("SET_FILTER_CUSTOM_DATE", date);
		}
	},

	computed: {
		...mapGetters(["FEEDING", "CUSTOM_DATE"]),

		filteredDate() {
			const options = {
				year: "numeric",
				month: "numeric",
				day: "numeric"
			};
			const filterDate = new Date(this.CUSTOM_DATE).toLocaleString(
				"ru",
				options
			);
			const arrFiltered = [];

			let i = 0;
			this.FEEDING.map(el => {
				if (
					filterDate ===
					new Date(el.starttime).toLocaleString("ru", options)
				) {
					el.i = ++i;
					arrFiltered.push(el);
				}
			});

			return arrFiltered;
		},

		eventsInDatapicker() {
			let arr = [];

			this.FEEDING.map(el => {
				let date = new Date(el.starttime)
					.toLocaleDateString()
					.split(".")
					.reverse();

				arr.push(date.join("-"));
			});

			return arr;
		}
	}
};
</script>

<style scoped>
.menu-date-input {
	width: 125px;
}
</style>
