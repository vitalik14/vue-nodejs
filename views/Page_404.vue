<template>
	<v-container>
		<div class="page">
			<div class="title">
				<h1>404</h1>
			</div>
			<div class="content-page fon page-404">
				<div>{{$t("message.page_not_found")}}</div>
			</div>
		</div>
	</v-container>
</template>

<script>
export default {
	name: "Page_404",

	data() {
		return {
			text: "text"
		};
	}
};
</script>

<style>
.page-404 {
	text-align: center;
}
</style>