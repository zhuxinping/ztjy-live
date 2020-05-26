<template>
  <div
    :class="messageIconClass"
    @click="handleIconClick"
  ></div>
</template>

<script>
export default {
	name: 'MessageStatusIcon',
	props: {
		message: {
			type: Object,
			required: true
		}
	},
	computed: {
		messageIconClass () {
			switch (this.message.status) {
			case 'unSend':
				return 'el-icon-loading'
			case 'fail':
				return 'message-send-fail'
			default:
				return ''
			}
		}
	},
	methods: {
		handleIconClick () {
			if (this.messageIconClass === 'message-send-fail') {
				window.tim.resendMessage(this.message).catch(imError => {
					this.$store.commit('showMessage', {
						message: imError.message,
						type: 'error'
					})
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.message-send-fail {
  margin-left: 20px;
  background: url('./img/icon-error.png') center/cover no-repeat;
  color: #fff;
  border-radius: 50%;
  text-align: center;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
  cursor: pointer;
}
</style>
