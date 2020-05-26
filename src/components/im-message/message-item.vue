<template>
  <div class="message-item-wrapper" v-if="message.type === TIM.TYPES.MSG_CUSTOM">
		<!-- 竖版用户进入提示信息 -->
		<div class="message-enter-tips" v-if="layout === 'vertical'">
			<custom-element
				v-if="isEnterMsg && isMine"
				:isMine="isMine"
				:payload="message.payload"
				:message="message"
				:layout="layout"
			/>
		</div>
    <div
      class="group-layout"
      :class="messagePosition"
			v-if="!isEnterMsg"
    >
      <!-- 消息主体 -->
      <div class="content-wrapper" :class="{mr0: layout === 'vertical'}">
        <custom-element
          :isMine="isMine"
          :payload="message.payload"
          :message="message"
          :layout="layout"
        />
        <!-- <span v-else>未知消息</span> -->
      </div>
    </div>
		<!-- 竖版进入安全提示信息 -->
		<div slot="enterTips" class="enter-tips" v-if="isMine && enterTips && !inited">
			{{enterTips}}
		</div>
  </div>
</template>

<script>
import CustomElement from './message-elements/custom-element.vue'
// let executeStatus = false
export default {
	name: 'MessageItem',
	props: {
		layout: {
			type: String,
			default: 'horizontal'
		},
		message: {
			type: Object,
			required: true
		},
		enterTips: {
			type: String,
			default: ''
		},
		isEnterMsg: {
			type: Boolean,
			default: false
		}
	},
	components: {
		CustomElement
	},
	data () {
		return {
			inited: false
		}
	},
	computed: {
		isMine () {
			return this.message.flow === 'out'
		},
		messagePosition () {
			if (this.layout !== 'horizontal') return
			if (
				['TIMGroupTipElem', 'TIMGroupSystemNoticeElem'].includes(
					this.message.type
				) ||
				this.isBusiness(this.message)
			) {
				return 'position-center'
			} else {
				return 'position-left'
			}
		}
	},
	methods: {
		isBusiness (msg) {
			if (!msg.payload || typeof msg.payload !== 'object') return
			if (msg.local) return true // 本地舆情提示
			const data = msg.payload.data
			if (typeof data === 'object') {
				if (!this.inited && data.msgInfo.body.joinType === 1) {
					this.inited = true
				}
				return data.businessInfo && data.businessInfo.type === 2
			} else if (this.isJSON(data)) {
				const obj = JSON.parse(data)
				if (!this.inited && obj.msgInfo.body.joinType === 1) {
					this.inited = true
				}
				return obj.businessInfo && (obj.businessInfo.type === 2)
			} else {
				return false
			}
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
.message-item-wrapper {
	width: 100%;
  .content-wrapper {
    display: flex;
    align-items: center;
    margin-left: 20px;
		margin-right: 20px;
		// margin-top: 20px;
		&.mr0 {
			margin-right: 0;
		}
  }
	.enter-tips {
		color: #fff;
		background-color: rgba(0,0,0,.3);
		border-radius: 30px;
		font-size: 24px;
		padding: 20px;
		box-sizing: border-box;
		margin-left: 20px;
	}
}
.message-enter-tips {
	height: 90px;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
.group-layout {
  display: flex;

  // &.position-left {

  // }

  // &.position-right {
  //   flex-direction: row-reverse;
  // }

  &.position-center {
    justify-content: center;
  }
}

</style>
