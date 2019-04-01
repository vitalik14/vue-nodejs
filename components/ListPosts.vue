<template>
	<div class="blog-list">
		<v-progress-linear v-if="loader" class="progress" height="15" :indeterminate="true"></v-progress-linear>
		<v-card-text>
			<v-autocomplete
				v-model="model"
				:items="POSTS"
				:loading="isLoading"
				:search-input.sync="search"
				color="white"
				hide-no-data
				hide-selected
				item-text="title"
				item-value="id"
				label="Поиск страниц"
				placeholder="Начните вводить для поиска"
				prepend-icon="mdi-database-search"
				return-object
			></v-autocomplete>
		</v-card-text>
		<v-divider></v-divider>
		<div class="wrapper-blog" v-if="model">
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn :disabled="!model" color="blue-grey" class="white--text" @click="model = null">Clear
					<v-icon right>mdi-close-circle</v-icon>
				</v-btn>
			</v-card-actions>
			<div class="header">
				<v-icon :style="'color:' + getVInterface(field.type).color">{{getVInterface(field.type).icon}}</v-icon>
				&nbsp; {{field.title}}
				<div class="meta-post">
					<div class="post-title">
						<span>author:</span>
						{{field.name}}
					</div>
					<div class="post-data">
						<span>created:</span>
						{{new Date(field.created).toLocaleDateString()}}
					</div>
				</div>
			</div>
			<v-card>
				<v-card-text v-html="field.long_text"></v-card-text>
			</v-card>
		</div>
		<div class="wrapper-blog" v-else>
			<v-expansion-panel>
				<v-expansion-panel-content v-for="(item, i) in currentPageArr" :key="i">
					<div slot="header">
						<v-icon :style="'color:' + getVInterface(item.type).color">{{getVInterface(item.type).icon}}</v-icon>
						&nbsp; {{item.title}}
						<div class="meta-post">
							<div class="post-title">
								<span>author:</span>
								{{item.name}}
							</div>
							<div class="post-data">
								<span>created:</span>
								{{new Date(item.created).toLocaleDateString()}}
							</div>
						</div>
					</div>
					<v-card>
						<transition v-on:enter="enter" v-on:after-leave="leave" name="bounce" tag="div" mode="in-out">
							<v-card-text v-html="item.long_text" :class="{'short-text': !item.opened}"></v-card-text>
						</transition>
						<v-flex class="btn-wrapper">
							<v-btn
								@click="ready($event, item, i)"
								:color="getVInterface(item.type).color"
								class="mx-0-inline-block"
								outline
							>{{item.opened ? 'Свернуть': 'Читать дальше'}}</v-btn>
						</v-flex>
					</v-card>
				</v-expansion-panel-content>
			</v-expansion-panel>

			<div class="text-xs-center my-3">
				<v-pagination v-model="currentPage" :length="amountPostsPages" @input="renderPage" circle></v-pagination>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
	name: "Posts",

	data() {
		return {
			amountVisiblePosts: 8,
			currentPageArr: [],
			currentPage: 1,
			amountPostsPages: 0,
			loader: false,
			vise: false,
			show: false,
			descriptionLimit: 60,
			entries: [],
			isLoading: false,
			model: null,
			search: null
		};
	},

	created() {
		this.loader = true;

		this.$store.dispatch("loadPosts").then(el => {
			this.loader = false;
			this.setPage(+this.$route.params.id || 1);
		});
	},

	methods: {
		enter(el, done) {
			console.log("ENTER");
			done();
		},
		leave(el, done) {
			console.log("LIVE");
		},

		ready(event, item, index) {
			this.currentPageArr.forEach(el => {
				if (el.id === item.id) {
					if (el.opened) {
						let el =
							event.currentTarget.parentNode.parentNode.parentNode
								.previousElementSibling;
						el.click();
					} else {
						el.opened = true;
					}
				} else {
					el.opened = false;
				}
			});
		},

		getVInterface(num) {
			switch (num) {
				case 1:
					return {
						icon: "security",
						color: "#ef7c88"
					};
				case 2:
					return {
						icon: "restaurant_menu",
						color: "#77d872"
					};
				case 3:
					return {
						icon: "child_friendly",
						color: "#6556dc"
					};
				case 4:
					return {
						icon: "language",
						color: "#dc56b2"
					};
			}
		},

		shuffle: function() {
			this.currentPageArr = this.currentPageArr.reverse();
		},

		setPage(page) {
			this.amountPostsPages = Math.ceil(
				this.POSTS.length / this.amountVisiblePosts
			);

			if (this.amountPostsPages >= page) {
				this.currentPage = page;
			} else {
				this.currentPage = 1;
			}

			this.renderPage(this.currentPage);
		},

		renderPage(page) {
			this.$router.push({
				name: "Blog",
				params: {
					id: page
				}
			});

			let start =
				page * this.amountVisiblePosts - this.amountVisiblePosts;
			let buf = [];

			this.currentPageArr = [];

			for (
				let i = start, length = this.POSTS.length;
				i < start + this.amountVisiblePosts;
				i++
			) {
				if (i >= length) {
					break;
				}

				buf.push(this.POSTS[i]);
			}

			this.currentPageArr = buf;
		}
	},
	computed: {
		...mapGetters(["POSTS"]),

		field() {
			return this.model || [];
		},

		items() {
			return this.entries.map(entry => {
				const title =
					entry.title.length > this.descriptionLimit
						? entry.title.slice(0, this.descriptionLimit) + "..."
						: entry.title;

				return Object.assign({}, entry, {
					title
				});
			});
		}
	},

	watch: {
		search(val) {
			if (this.items.length > 0) return;

			if (this.isLoading) return;

			this.entries = this.POSTS;
		}
	}
};
</script>

<style>
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

.v-expansion-panel__header > div {
	font-weight: bold;
}

.short-text {
	max-height: 150px;
	margin-bottom: 15px;
	overflow: hidden;
}

.short-text:before {
	content: "";
	position: absolute;
	z-index: 10;
	top: auto;
	bottom: 55px;
	left: 0;
	height: 50px;
	width: 100%;
	background: linear-gradient(
		to top,
		rgba(255, 255, 255, 1),
		rgba(255, 255, 255, 1),
		rgba(255, 255, 255, 0.7),
		rgba(255, 255, 255, 0)
	);
}

.bounce-enter-active {
	animation: bounce-in 0.5s;
}

.meta-post {
	display: flex;
	justify-content: space-between;
	margin: 10px 0 0;
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

.wrapper-blog .header {
	background: #fff;
	padding: 16px;
	color: #666;
	font-size: 16px;
	border-radius: 10px 10px 0 0;
	font-weight: bold;
}

.wrapper-blog .v-expansion-panel__container {
	border-radius: 10px 10px;
}

.fl-left {
	float: left;
}
.fl-right {
	float: right;
}
</style>
