<template>
<div>
	<v-layout row wrap>
		<v-flex xs12 sm6 class="form-add-item px-4 py-4">
			<v-flex xs12 sm12>
				<v-flex justify-center>
					<v-menu class="menu-date-input-reg" :close-on-content-click="false" v-model="menu" :nudge-right="40" lazy transition="scale-transition" offset-y>
						<v-text-field slot="activator" v-model="date" label="Дата" prepend-icon="event" readonly></v-text-field>
						<v-date-picker :max="maxDate" v-model="date" event-color="green lighten-1" @input="menu = false"></v-date-picker>
					</v-menu>
				</v-flex>
			</v-flex>
			<v-flex>
				<v-text-field placeholder="30 - 300" :rules='[errorMessages(txtGrowth)]' v-model="txtGrowth" type="Number" counter=5 label="Рост" value="60" suffix="см" required></v-text-field>
			</v-flex>
			<v-flex>
				<v-text-field placeholder="1.500 - 300" :rules='[errorMessages(txtWeight)]' v-model="txtWeight" type="Number" counter=5 label="Вес" value="28.00" suffix="кг" required></v-text-field>
			</v-flex>

		</v-flex>
		<v-flex xs12 sm6 class="form-add-item px-4 py-4">
			<v-textarea name="input-7-1" v-model="txtComment" box label="Коментарий" height="200" no-resize value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."></v-textarea>
			<v-btn :disabled="checked" color="success" @click="addItem()">Добавить</v-btn>
		</v-flex>
	</v-layout>
	<v-progress-linear v-if="loader" class="progress" height="15" :indeterminate="true"></v-progress-linear>
	<v-data-iterator :items="CHILD_OPTIONS" :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" content-tag="v-layout" row wrap>
		<v-flex slot="item" slot-scope="props" xs12 sm4 md3 lg3 class="wrapper-rows">
			<v-card>
				<v-card-title>
					<h4>{{ new Date(props.item.date).toLocaleDateString() }}</h4>
					<v-spacer></v-spacer>
					<v-btn icon @click="deleteItem(props.item.id)">
						<v-icon>delete_forever</v-icon>
					</v-btn>
				</v-card-title>
				<v-divider></v-divider>
				<v-list dense>
					<v-list-tile>
						<v-list-tile-content>Рост:</v-list-tile-content>
						<v-list-tile-content class="align-end">{{ props.item.growth }}</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-content>Вес:</v-list-tile-content>
						<v-list-tile-content class="align-end">{{ props.item.weight }}</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-content>Комментарий:</v-list-tile-content>
						<div class="comment-wrap">
							<v-icon class="icon-uses-comment" @click="showComment($event)" v-if="!!props.item.comment">insert_comment</v-icon>
							<v-icon v-else>blur_on</v-icon>
							<div v-if="!!props.item.comment" class="align-end comment">
								<v-icon @click="closeComment($event)" class="icon-close">clear</v-icon>
								<div class="comment-content">{{ props.item.comment }}</div>
							</div>
						</div>
					</v-list-tile>
				</v-list>
			</v-card>
		</v-flex>
	</v-data-iterator>
	<Statistic />
</div>
</template>
<script>
import {
	mapGetters
} from 'vuex';
import Statistic from '@/components/statistic/ChildOptions';

let options = {
	textFieldMaxNumber: 300,
	textFieldMinNumber: 0,
}

export default {
	name: "ChildOptions",

	components: {
		Statistic
	},

	data() {
		return {
			rowsPerPageItems: [4, 8, 12],
			pagination: {
				rowsPerPage: 8
			},
			date: new Date().toLocaleDateString().split('.').reverse().join('-'),
			menu: false,
			amountVisiblePosts: 10,
			currentPageArr: [],
			currentPage: 1,
			amountPostsPages: 0,
			loader: false,
			txtWeight: '',
			txtGrowth: '',
			txtComment: ''
		}
	},

	created() {
		this.maxDate = this.date;
		this.loader = true;

		this.$store.dispatch('loadChildOptions').then(el => {
			this.loader = false;
		});
	},

	methods: {
		async addItem() {
			const item = {
				date: new Date(this.date).getTime(),
				weight: this.txtWeight,
				growth: this.txtGrowth,
				comment: this.txtComment
			};

			const res = await this.$store.dispatch('addOption', item).then(res => res);

			if (res.status) {
				this.reset();
			}

			this.$notify({
				group: 'message',
				type: res.status ? 'success': 'error',
				title: res.message,
			});
		},

		async deleteItem(id) {
			const res = await this.$store.dispatch('deleteOption', {id}).then(res => res);

			this.$notify({
				group: 'message',
				type: res.status ? 'success': 'error',
				title: res.message
			});
		},

		errorMessages(txt) {
			//debugger;
			if (txt === 0) return true;
			const obj = {
				lengthMax: 'Макс. число ' + options.textFieldMaxNumber,
				lengthMin: 'Мин число ' + options.textFieldMinNumber,
				errorValue: 'Не корректное значение'
			};

			switch (true) {
				case !parseInt(txt):
					return obj.errorValue;
				case txt > options.textFieldMaxNumber:
					return obj.lengthMax;
				case txt < options.textFieldMinNumber:
					return obj.lengthMin;
				default:
					return true;
			}
		},

		reset() {
			this.txtWeight = this.txtGrowth = 0;
			this.txtComment = '';
		},

		showComment(event) {
			event.target.parentElement.classList.add('show');
		},

		closeComment(event) {
			event.currentTarget.parentElement.parentElement.classList.remove('show');
		}
	},

	computed: {
		...mapGetters(['CHILD_OPTIONS']),

		checked() {
			if (typeof this.errorMessages(this.txtWeight) === 'boolean' && typeof this.errorMessages(this.txtGrowth) === 'boolean') {
				return false;
			}

			return true;
		}
	}
}
</script>

<style>
.v-data-iterator {
	background: #f3f3f3;
}

.v-data-iterator .v-card__title {
	padding: 0 0 0 16px;
}

.wrapper-rows {
	padding: 10px
}

.wrapper-rows .v-btn--icon {
	width: auto
}

.anime {
	max-width: 100%;
}

.v-timeline-item__body {
	position: relative;
}

.btn-wrapper {
	text-align: center;
}

.mx-0-inline-block {
	display: inline-block;
	width: 100%;
}

.v-expansion-panel__header {
	color: #666;
	font-size: 16px;
}

.v-expansion-panel__container {
	background-color: #fff;
	box-shadow: 0 0 10px #aaa;
	margin: 3px 0;
}

.v-expansion-panel__container--active {
	margin: 15px 0 15px;
}

.v-expansion-panel__header>div {
	font-weight: bold;
}

.short-text {
	max-height: 150px;
	margin-bottom: 15px;
	overflow: hidden;
}

.short-text:before {
	content: '';
	position: absolute;
	z-index: 10;
	top: auto;
	bottom: 55px;
	left: 0;
	height: 50px;
	width: 100%;
	background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
}

.bounce-enter-active {
	animation: bounce-in 0.5s;
}

.meta-post {
	display: flex;
	justify-content: space-between;
	margin: 10px 0 0
}

.post-title,
.post-data {
	font-weight: bold;
	font-size: 12px;
}

.post-title span,
.post-data span {
	font-weight: normal;
}

@keyframes bounce-in {
	0% {
		opacity: 0.7;
	}
	50% {
		opacity: 0.4;
	}
	100% {
		opacity: 0;
	}
}

.form-add-item {
	background: #fff;
	/* max-width: 280px;
	margin: 0 auto; */
}

.v-menu--inline {
	display: block;
}

.progress.v-progress-linear {
	margin: 0;
}


/* comment */

.show .icon-uses-comment {
	display: none;
}

.comment {
	background: #f3f3f3;
	padding: 10px 10px 10px;
	position: absolute;
	top: 30px;
	left: 0;
	z-index: 1;
	border: 1px solid #ccc;
	border-radius: 0px 0px 3px 3px;
	width: calc(100%);
	display: none;
}

.comment .icon-close {
	cursor: pointer;
	position: absolute;
	top: -23px;
	right: 14px;
	background: #eee;
	border: 1px solid #ccc;
	border-bottom: none;
	border-radius: 3px 3px 0px 0px;
	color: red;
}

.comment-content {
	overflow: hidden;
	text-overflow: ellipsis;
}

.show .comment {
	display: block;
}
</style>