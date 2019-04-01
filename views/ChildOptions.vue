<template>
	<v-container>
		<div class="page">
			<div class="title">
				<h1>{{$t("message.weight_and_growth")}}</h1>
			</div>
			<Test name="ttttt">ghj</Test>
			<div class="content-page fon">
				<ChildOptions/>
			</div>
			<Test to="ttttt">ghj666666666</Test>
		</div>
	</v-container>
</template>

<script>
import ChildOptions from "@/components/ChildOptions";

export default {
	name: "PageChildOptions",

	components: {
		ChildOptions
	}
};
</script>

<style>
</style>