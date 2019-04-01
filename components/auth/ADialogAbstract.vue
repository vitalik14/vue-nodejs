<template></template>

<script>
export default {
	name: "ADialogAbstract",

	data() {
		return {
			info: false,
			message: "",
			infoClass: ""
		};
	},

	activated() {
		this.dialog = true;
	},

	methods: {
		validEmail(email) {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},
		closeForm() {
			this.$emit("dialogEvent", {
				type: "close"
			});
		}
	}
};
</script>

<style>
.message.success {
	background: green;
	color: #fff;
	font-size: 16px;
}
.message.info {
	background: blue;
	color: #fff;
	font-size: 16px;
}
.closeform {
	position: absolute;
	width: 30px;
	height: 30px;
	text-align: center;
	line-height: 1.4;
	top: 20px;
	right: 20px;
	font-size: 22px;
	background: #efefef;
	border-radius: 50%;
	cursor: pointer;
}
</style>
