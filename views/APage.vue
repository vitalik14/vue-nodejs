<template>
	
</template>

<script>
import {
	mapGetters
} from "vuex";

export default {
	name: 'APage',

	data() {
		return {
			onlyForMembers: false
		}
	},

	computed: {
		...mapGetters(['AUTH'])
	}
}
</script>

<style>
.content-page {
	max-width: 1600px;
}
</style>
