<template>
	<div class="intro-container">
		<div v-if="liveIntroduction" v-html="liveIntroduction"></div>
		<div v-else class="empty">
			<img :src="nodataimg" alt="">
			<p>该内容暂无简介</p>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		liveIntroduction: {
			default: ''
		}
	},
	data () {
		return {
			nodataimg: require('@/assets/images/live/icon_qs1@3x.png')
		}
	},
	methods: {
	}
}
</script>
<style lang="scss" scoped>
	.intro-container {
		font-size: 40px;
		/deep/ img{
			max-width: 100%!important;
		}
	}
	.empty{
		text-align: center;
		padding: 100px 0;
		background: #fff;
	}
	.empty img{
		width: 501px;
		height: 291px;
	}
	.empty p{
		margin-top: 20px;
		font-size: 32px;
		color: #333333;
	}
</style>
