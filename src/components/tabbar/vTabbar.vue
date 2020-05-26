<template>
	<div class="tabbar-container">
		<ul class="tabbar-wrapper">
			<li v-for="item in items" :key="item.value" :class="{selected: selectedItem === item.value}" @click="change(item.value)" class="tabbar-item">
				<span class="item-text">{{item.label}}</span>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	name: 'vTabbar',
	props: {
		items: {
			type: Array,
			default: () => [{ label: '互动', value: 1 }, { label: '简介', value: 2 }]
		}
	},
	data () {
		return {
			selectedItem: 1
		}
	},
	methods: {
		change (value) {
			if (this.selectedItem !== value) {
				this.selectedItem = value
				this.$emit('change', value)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.tabbar-container {
		width: 100%;
		height: 90px;
		border-bottom: 1px solid rgba(238,238,238,1); /*no*/
		.tabbar-wrapper {
			height: inherit;
			display: flex;
		}
		.tabbar-item {
			flex: 1;
			display: flex;
			justify-content: center;
			font-size: 32px;
			color: #333333;
			&.selected {
				color: #00aaff;
				.item-text {
					border-color: #00aaff;
				}
			}
		}
		.item-text {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 28px;
			border-bottom: 3px solid transparent;
			box-sizing: border-box;
		}
	}
</style>
