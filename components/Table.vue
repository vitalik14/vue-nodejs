<template>
	<v-data-table :headers="headers" :items="data" class="elevation-1">
		<template slot="headerCell" slot-scope="props">
			<v-tooltip bottom>
				<span slot="activator">{{ $t("message." + props.header.text) }}</span>
				<span>{{ $t("message." + props.header.text) }}</span>
			</v-tooltip>
		</template>
		<template slot="items" slot-scope="props">
			<td class="text-xs-right">{{ props.item.i }}</td>
			<td class="text-xs-right">{{ new Date(props.item.starttime).toLocaleTimeString() }}</td>
			<td class="text-xs-right">{{ new Date(props.item.endtime).toLocaleTimeString() }}</td>
			<td class="text-xs-right">{{ differenceDate(props.item.starttime, props.item.endtime) }}</td>
			<td class="text-xs-right">{{ props.item.chest === 1?$t("message.left"): $t("message.right") }}</td>
		</template>
	</v-data-table>
</template>

<script>
export default {
	name: "TableT",

	props: ["data"],

	methods: {
		deleteTime(id) {
			if (id) {
				this.$store
					.dispatch("deleteTime", {
						id
					})
					.then(success => {
						this.$notify({
							group: "message",
							type: success ? "success" : "error",
							title: success
								? "Удаленно!"
								: "Ошибка! перезайдите в аккаунт."
						});
					});
			}
		},

		differenceDate(start, end) {
			const minutes = Math.floor(
				((Math.abs(new Date(start) - new Date(end)) / 60) * 1000) /
					1000000
			);

			if (minutes > 59) {
				return (
					Math.floor(minutes / 60) + " ч. " + (minutes % 60) + " м. "
				);
			} else {
				return minutes + " м. ";
			}
		}
	},

	data() {
		return {
			headers: [
				{
					text: "№",
					sortable: true,
					value: "i",
					align: "right"
				},
				{
					text: "start",
					value: "starttime",
					align: "right",
					sortable: true
				},
				{
					text: "completion",
					value: "endtime",
					align: "right",
					sortable: false
				},
				{
					text: "duration",
					value: "endtime",
					align: "right",
					sortable: true
				},
				{
					text: "breast",
					value: "chest",
					align: "right",
					sortable: false
				}
			]
		};
	}
};
</script>
<style scoped>
.delete-item {
	cursor: pointer;
	color: red;
}
</style>
