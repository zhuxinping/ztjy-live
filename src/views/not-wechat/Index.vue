<template>
	<!-- 非微信打开 -->
	<div class="not-wechat-container">
		<img class="icon-wechat" src="@/assets/images/wechat.png" alt="">
		<div>请在微信内观看</div>
	</div>
</template>
<script>
export default {
	data () {
		return {}
	}
}
</script>
<style lang="scss">
	.not-wechat-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		background: #ddd;
		font-size: 34px;
		color: #8f8f8f;
		.icon-wechat {
			width: 128px;
			margin-bottom: 20px;
		}
	}
</style>
