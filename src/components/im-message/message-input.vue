<template>
	<div class="h-input-main" v-if="initData.layout === 'horizontal'">
		<div class="h-input-item">
			<van-field
				class="h-input"
				v-model="msg"
				placeholder="说点什么吧~"
				type="textarea"
				maxlength="200"
				rows="1"
				:autosize="{ maxHeight: 90 }"
				@keyup.enter="sendMessage"
				@focus="handleFocus"
			>
				<template #button>
					<button class="c-btn" :disabled="!msg" @click="sendMessage">发送</button>
				</template>
			</van-field>
		</div>
		<img v-if="initData.giftInfo.enable" class="icon-gift" :src="initData.giftInfo.type === 1 ? iconGift : iconRedPacket" alt="gift" @click="sendGift">
	</div>
	<div class="v-input-item" @click="handleOpenApp" v-else>
		<div class="v-input">说点什么吧~</div>
	</div>
</template>
<script>
import { getUrlParam } from 'szyutils'
let url = window.location.origin
const prefix = url.includes('alpha') || url.includes('dev') ? 'alpha' : ''
export default {
	name: 'MessageInput',
	props: {
		initData: {
			type: Object,
			required: true
		},
		sendStatus: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			msg: '',
			send: false,
			iconGift: require('./img/icon-gift.png'),
			iconRedPacket: require('./img/icon-redpacket.png')
		}
	},
	watch: {
		sendStatus: function () {
			this.send = this.sendStatus
		}
	},
	methods: {
		sendMessage () {
			if (this.msg.length > 200) {
				this.$toast('最多可输入200个字')
				return
			}
			this.$emit('sendMessage', {
				'type': 'text',
				'data': this.msg
			})
			if (!this.send) {
				this.msg = ''
			}
			this.$szyreport.reportEvent({
				data: {
					event_id: 'click_openclass_imkeyboard_suc',
					obj_id: getUrlParam('liveId'),
					parm: {
						client: 3,
						livetype: this.initData.layout === 'horizontal' ? 1 : 2
					}
				},
				prefix
			})
		},
		sendGift () {
			this.$emit('sendGift')
		},
		handleOpenApp () {
			this.$emit('openAppClick')
		},
		handleFocus () {
			this.$szyreport.reportEvent({
				data: {
					event_id: 'click_openclass_imkeyboard',
					obj_id: getUrlParam('liveId'),
					parm: {
						client: 3,
						livetype: this.initData.layout === 'horizontal' ? 1 : 2
					}
				},
				prefix
			})
		},
		isJSON (str) { // 检测是否是JSON格式
			if (typeof str === 'string') {
				try {
					var obj = JSON.parse(str)
					if (typeof obj === 'object' && obj) {
						return true
					} else {
						return false
					}
				} catch (e) {
					console.log('error：' + str + '!!!' + e)
					return false
				}
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.h-input-main {
	background-color: #F2F3F5;
	min-height: 100px;
	width: 100%;
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;;
	padding: 15px 20px;
	box-sizing: border-box;
	line-height: 1.8;
	margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
	.h-input-item {
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
	}
	.h-input {
		min-height: 70px;
		width: 100%;
		font-size: 26px;
		padding: 10px 10px 10px 25px;
		box-sizing: border-box;
		border-radius: 10px;
		border: 0;
		outline: 0;
	}
	.c-btn {
		width: 100px;
		height: 50px;
		border-radius: 10px;
		background-color: #00AAFF;
		color: #fff;
		font-size:24px;
		border: 0;
		outline: 0;
		line-height: 50px;
		padding: 0;
		text-align: center;
		&[disabled] {
			background-color: #CCCCCC;
		}
	}
	.icon-gift {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		margin-left: 38px;
	}
	:global(.van-field__body) {
		align-items: flex-end;
	}
}

.v-input-item {
	width:280px;
	height:60px;
	margin: 0 0 44px 20px;
	.v-input {
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,.3);
		color: #BBBBBD;
		border-radius: 30px;
		border: 0;
		outline: 0;
		font-size: 26px;
		padding-left: 20px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
}
</style>
