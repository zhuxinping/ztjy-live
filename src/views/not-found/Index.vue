<template>
	<div class="not-found-container">
		<img class="icon-sign-empty" src="@/assets/images/expression.png" alt="">
		<div>签名不匹配，无法查看视频</div>
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
	.not-found-container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding-top: 300px;
		display: flex;
		flex-flow: column;
		// justify-content: center;
		align-items: center;
		font-size: 40px;
		color: #999;
		background: #f8f8f8;
		.icon-sign-empty {
			width: 220px;
			margin-bottom: 26px;
		}
	}
</style>
