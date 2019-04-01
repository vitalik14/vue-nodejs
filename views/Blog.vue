<template>
<v-container>
	<div class="page">
		<div class="title">
			<h1>{{$t("message.blog")}}</h1>
		</div>
		<div class="content-page fon">
			<ListPosts />
		</div>
	</div>
</v-container>
</template>

<script>
import ListPosts from '@/components/ListPosts';

export default {
	name: 'PageBlog',

	components: {
		ListPosts
	}
}
</script>

<style>

</style>
