<template>
	<v-container>
		<div class="page">
			<div class="title">
				<h1>{{$t("message.feeding")}}</h1>
			</div>
			<div class="content-page fon">
				<Feeding/>
			</div>
		</div>
	</v-container>
</template>

<script>
import Feeding from '@/components/Feeding';
import APage from '@/views/APage';

export default {
	extends: APage,

	name: 'PageFeeding',

	components: {
		Feeding
	}
}
</script>

<style>
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
	padding: 0px 12px !important;
}
</style>
