<template>
	<div class="hello-container">
		<h1>{{msg}}</h1>
	</div>
</template>
<script>
import { namespace } from '@/utils/client'
export default {
	data () {
		return {
			msg: namespace
		}
	},
	created () {
		alert(namespace)
	}
}
</script>
<style lang="scss" scoped>
	.hello-container {
		font-size: 40px;
	}
</style>
