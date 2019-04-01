<template>
	<div class="page">
		<div class="title">
			<h1>{{$t("message.blog")}}</h1>
		</div>
		<ListPosts/>
	</div>
</template>

<script>
import ListPosts from "@/components/ListPosts";

export default {
	name: "Post",

	components: {
		ListPosts
	}
};
</script>

<style>
</style>
