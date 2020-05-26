<template>
	<div class="custom-wrapper-horizontal" v-if="layout === 'horizontal'">
		<template v-if="msgData.type === 'text'">
			<div class="text-row">
				<div class="user-avatar">
					<img :src="msgData.avatar || defaultAvatar" />
				</div>
				<div class="user-main">
					<div class="name">{{isMine ? '我' : msgData.userName}}{{layout === 'horizontal' ? '：': ''}}</div>
					<div class="content" :class="{highlight: isMine}">
						<div class="c-text">{{msgData.textContent}}</div>
						<message-status-icon class="c-status" v-if="isMine" :message="message" />
					</div>
				</div>
			</div>
		</template>
		<template v-if="msgData.type === 'zan'">
			<div class="zan-row" :class="{animation: isMine}">
				<span class="name">{{msgData.userName}}</span> <span class="desc">{{zanTips}}</span> <img class="icon-heart" src="../img/icon-heart.png" alt="heart">
			</div>
		</template>
		<template v-if="msgData.type === 'gift'">
			<div class="gift-row">
				<img class="icon-gift" :src="msgData.imageUrl" alt="gift"> <span class="name">{{msgData.userName}}</span> <span class="desc">{{msgData.textContent}}</span>
			</div>
		</template>
		<template v-if="msgData.type === 'entrance'">
			<div class="entrance-row">
				{{welcomeTips.left}}<span class="name">{{msgData.userName}}</span>{{welcomeTips.right}}
			</div>
		</template>
		<template v-if="msgData.type === 'forbid-msg-tip'">
			<div class="forbid-msg-row">您的发言包含敏感词汇，请重新编辑后发送</div>
		</template>
		<!-- <template v-if="msgData.type === 'forbid' && msgData.forbidTip">
			<div class="forbid-row">
				{{msgData.forbidTip}}
			</div>
		</template> -->
  </div>
	<!-- 我是分割线 -->
	<div class="custom-wrapper-vertical" v-else>
		<template v-if="msgData.type === 'text'">
			<div class="text-row">
				<span class="name">{{msgData.userName}}{{layout !== 'horizontal' ? '：': ''}}</span>
				<span class="content" :class="{highlight: isMine}">{{msgData.textContent}}</span>
			</div>
		</template>
		<template v-if="msgData.type === 'zan'">
			<div class="zan-row">
				<div class="user-avatar">
					<img :src="msgData.avatar || defaultAvatar" />
				</div>
				<div class="user-main">
					<div class="name">{{msgData.userName}}{{layout === 'horizontal' ? '：': ''}}</div>
					<div class="content" :class="{highlight: isMine}">{{zanTips}}</div>
				</div>
				<img class="icon-heart" src="../img/heart.png" alt="heart">
			</div>
		</template>
		<template v-if="msgData.type === 'gift'">
			<div class="gift-row">
				<div class="user-avatar">
					<img :src="msgData.avatar || defaultAvatar" />
				</div>
				<div class="user-main">
					<div class="name">{{msgData.userName}}{{layout === 'horizontal' ? '：': ''}}</div>
					<div class="content" :class="{highlight: isMine}">{{msgData.textContent}}</div>
				</div>
				<img class="icon-gift" :src="msgData.imageUrl" alt="gift">
			</div>
		</template>
		<template v-if="msgData.type === 'entrance'">
			<div class="entrance-row animation">
				<img class="icon-tips" src="../img/icon-tips.png" alt="tips"> <span>{{welcomeTips.left}}</span><span class="name">{{msgData.userName}}</span><span>{{welcomeTips.right}}</span>
			</div>
		</template>
		<!-- <template v-if="msgData.type === 'forbid'">
			<div class="forbid-row">
				{{msgData.forbidTip}}
			</div>
		</template> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MessageStatusIcon from '../message-status-icon.vue'
export default {
	name: 'CustomElement',
	props: {
		payload: {
			type: Object,
			required: true
		},
		message: {
			type: Object,
			required: true
		},
		isMine: {
			type: Boolean
		},
		layout: {
			type: String,
			required: true
		}
	},
	components: {
		MessageStatusIcon
	},
	computed: {
		...mapState({
			currentConversation: state => state.conversation.currentConversation,
			currentUserProfile: state => state.user.currentUserProfile
		}),
		// 是否显示头像，群提示消息不显示头像
		showAvatar () {
			if (this.currentConversation.type === 'GROUP' && !this.message.isRevoked) { // group且没有撤回的消息
				return this.message.type !== this.TIM.TYPES.MSG_GRP_TIP
			}
			return false
		},
		avatar () {
			if (this.currentConversation.type === 'GROUP') {
				return this.isMine
					? this.currentUserProfile.avatar
					: this.message.avatar
			} else {
				return ''
			}
		},
		msgData () {
			return this.translateCustomMessage(this.payload)
		}
	},
	data () {
		return {
			tipsInited: false,
			defaultAvatar: require('../img/icon-avatar.png'),
			zanTips: {},
			welcomeTips: {}
		}
	},
	created () {
		this.copyright = JSON.parse(localStorage.getItem('copyright')) || {
			'ZB-A0009': '[用户昵称]给老师点赞',
			'ZB-A0008': '欢迎[用户昵称]进入直播间'
		}
		if (this.copyright['ZB-A0008']) {
			this.zanTips = this.copyright['ZB-A0009'].split('[用户昵称]')[1]
			this.welcomeTips = {
				left: this.copyright['ZB-A0008'].split('[用户昵称]')[0],
				right: this.copyright['ZB-A0008'].split('[用户昵称]')[1]
			}
		}
	},
	methods: {
		translateCustomMessage (payload) {
			let datas = {}
			if (typeof payload.data === 'object') {
				datas = payload.data
			} else if (this.isJSON(payload.data)) {
				datas = JSON.parse(payload.data)
			} else {
				return '未知消息'
			}
			if (datas.type === 'forbid-msg-tip') {
				return datas
			}
			if (!datas.businessInfo) return ''
			// 1:聊天消息  2:业务消息
			if (datas.businessInfo.type === 1) {
				const type = datas.msgInfo.type
				switch (type) {
				case 1: // 文字消息
					return {
						type: 'text',
						avatar: datas.senderInfo.userAvatar,
						userName: datas.senderInfo.userName,
						textContent: datas.msgInfo.body.textContent
					}
				default:
					return '未知消息'
				}
			} else if (datas.businessInfo.type === 2) {
				const type = datas.msgInfo.type
				switch (type) {
				case 1: // 点赞消息
					return {
						type: 'zan',
						avatar: datas.senderInfo.userAvatar,
						userName: datas.senderInfo.userName,
						tip: datas.msgInfo.body.tip
					}
				case 2: // 用户进出直播室消息，只处理进入提示
					return datas.msgInfo.body.joinType === 1 ? {
						type: 'entrance',
						avatar: datas.senderInfo.userAvatar,
						userName: datas.senderInfo.userName,
						joinType: datas.msgInfo.body.joinType,
						joinTip: datas.msgInfo.body.joinTip
					} : {}
				case 3: // 主播状态消息
					// 监听主播状态
					this.$bus.$emit('onLivePlayEnd', datas.msgInfo.body)
					return {
						type: 'anchor',
						avatar: datas.senderInfo.userAvatar,
						userName: datas.senderInfo.userName,
						state: datas.msgInfo.body.state,
						tip: datas.msgInfo.body.tip
					}
				case 4: // 禁言消息
					return {
						type: 'forbid',
						avatar: datas.senderInfo.userAvatar,
						userName: datas.senderInfo.userName,
						forbidType: datas.msgInfo.body.forbidType, // 禁言类型，取值：1按用户ID禁言，2全体
						forbidFlag: datas.msgInfo.body.forbidFlag, // 0：取消禁言，1：开启禁言
						forbidUsers: datas.msgInfo.body.forbidUsers, // 禁言人ID，禁言类型为1时生效
						duration: datas.msgInfo.body.duration, // 禁言时长，单位秒
						forbidTip: datas.msgInfo.body.forbidTip // 禁言提示
					}
				case 5: // 礼物消息
					return {
						type: 'gift',
						avatar: datas.senderInfo.userAvatar,
						userName: datas.senderInfo.userName,
						giftType: datas.msgInfo.body.giftType, // 礼物类型 1 普通礼物 2 红包礼物
						imageUrl: datas.msgInfo.body.imageUrl, // 礼物图标URL
						cnt: datas.msgInfo.body.cnt, // 数量
						price: datas.msgInfo.body.price || 0, // 价格 单位：分
						textContent: datas.msgInfo.body.textContent // 礼物文本提示
					}
				default:
					return '未知消息'
				}
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
.custom-wrapper-horizontal {
	.text-row, .zan-row, .gift-row, .entrance-row, .forbid-row, .forbid-msg-row {
		margin-top: 20px;
	}
	.text-row {
		display: flex;
		.user-avatar {
			width: 64px;
			height: 64px;
			border-radius: 50%;
			margin-right: 18px;
			flex-shrink: 0;
			> img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				vertical-align: middle;
			}
		}
		.user-main {
			font-size: 26px;
			.name {
				color: #333;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width: 600px;
			}
			.content {
				color: #818D9D;
				word-break: break-all;
				display: flex;
				align-items: center;
				.c-status {
					flex-shrink: 0;
				}
				&.highlight {
					color: #64B4DB;
				}
			}
		}
	}
	.entrance-row {
		color: #818D9D;
		font-size: 22px;
		height: 48px;
		line-height: 48px;
		background-color: #F2F3F5;
		border-radius: 999px;
		padding: 0 20px;
		.name {
			color: #00AAFF;
			margin: 0 10px;
		}
	}
	.forbid-row {
		color: #FF5E68;
		font-size: 22px;
		height: 48px;
		line-height: 48px;
		background-color: #F2F3F5;
		border-radius: 999px;
		padding: 0 20px;
	}
	.zan-row {
		display: flex;
		justify-content: center;
		font-size: 22px;
		align-items: center;
		height: 48px;
		background-color: #F2F3F5;
		border-radius: 999px;
		padding: 0 20px;
		&.animation {
			animation: zanmoveup 1s ease-in-out forwards;
		}
		.name {
			color: #00AAFF;
			margin-left: 14px;
		}
		.desc {
			color: #818D9D;
			margin: 0 10px;
		}
		.icon-heart {
			width: 34px;
			height: 25px;
			vertical-align: middle;
			margin-left: 10px;
		}
	}
	.gift-row {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100px;
		background-color: #F2F3F5;
		border-radius: 24px;
		padding: 0 20px;
		font-size: 24px;
		.icon-gift {
			width: 86px;
			height: 86px;
			vertical-align: middle;
			flex-shrink: 0;
		}
		.name {
			color: #00AAFF;
			margin: 0 14px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 200px;
		}
		.desc {
			color: #FE7955;
		}
	}
	.forbid-msg-row {
		color: #818D9D;
		font-size: 22px;
		height: 48px;
		line-height: 48px;
		background-color: #F2F3F5;
		border-radius: 999px;
		padding: 0 20px;
	}
}
.custom-wrapper-vertical {
	.text-row, .zan-row, .gift-row, .forbid-row {
		margin-top: 28px;
	}
	.text-row {
		background-color: rgba(0,0,0,.3);
		font-size: 26px;
		padding: 10px 15px;
		border-radius: 30px;
		.name {
			color: #FFBA00;
			word-break: break-all;
		}
		.content {
			color: #fff;
			word-break: break-all;
			&.highlight {
				color: #64B4DB;
			}
		}
	}
	.entrance-row {
		color: #fff;
		font-size: 26px;
		height: 60px;
		line-height: 60px;
		background-color: rgba(0,0,0, .3);
		border-radius: 999px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 20px;
		&.animation {
			animation: right2left 2s ease-in-out forwards;
		}
		.icon-tips {
			width: 26px;
			height: 22px;
			vertical-align: middle;
			margin-right: 18px;
		}
		.name {
			color: #8DE7FE;
			margin: 0 14px;
			word-break: break-all;
			line-height: inherit;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 120px;
		}
	}
	.zan-row, .gift-row {
		background-color: rgba(0,0,0, .3);
		border-radius:30px;
		padding: 15px;
		display: flex;
		align-items: center;
		width: 100%;
    box-sizing: border-box;
		.user-avatar {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			margin-right: 18px;
			flex-shrink: 0;
			> img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				vertical-align: middle;
			}
		}
		.user-main {
			font-size: 30px;
			flex: 1;
			.name {
				color: #8DE7FE;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 200px;
			}
			.content {
				font-size: 26px;
				color: #FFBA00;
			}
		}
		.icon-heart {
			width: 66px;
			height: 54px;
			vertical-align: middle;
			margin-left: 15px;
			flex-shrink: 0;
		}
		.icon-gift {
			width: 66px;
			height: 66px;
			vertical-align: middle;
			margin-left: 15px;
			flex-shrink: 0;
		}
	}
	.forbid-row {
		color: #F43B47;
		font-size: 26px;
		height: 60px;
		line-height: 60px;
		background-color: rgba(0,0,0, .3);
		border-radius: 999px;
		padding: 0 20px;
	}
}
@keyframes zanmoveup {
  0% {
		transform: translate3d(0, 25px, 0);
		opacity: 0;
	}
	10% {
		transform: translate3d(0, 25px, 0);
		opacity: 0.2;
	}
	100% {
		transform: translate3d(0, 0, 0);
		opacity: 1;
	}
}
@keyframes right2left {
  0% {
		transform: translate3d(300%, 0, 0);
	}
	20% {
		transform: translate3d(0, 0, 0);
	}
	90% {
		transform: translate3d(0, 0, 0);
	}
	100% {
		transform: translate3d(-200%, 0, 0);
	}
}
</style>
