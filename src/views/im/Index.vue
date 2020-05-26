<template>
	<div class="im-container" :style="{height: height + 'px'}">
		<div class="video-placeholder">
			video
		</div>
		<div class="tabs-row">
			<div class="current">互动</div>
			<div @click="handleSendGift">送礼测试</div>
			<div>精彩内容</div>
		</div>
		<div class="tabs-content">
			<custom-message v-if="initData.userID" :initData="initData" ref="current-message" @sendGift="sendGift" @close="handleClose" @openApp="handleOpenApp"></custom-message>
		</div>
	</div>
</template>
<script>
import customMessage from '@/components/im-message/message'
import { getUrlParam } from 'szyutils'
import { IM } from '@/api/index'
export default {
	components: {
		customMessage
	},
	data () {
		return {
			height: 768,
			initData: {
				layout: getUrlParam('layout') || 'horizontal', // 默认 horizontal 横版，竖版 vertical
				groupID: getUrlParam('groupId') || '@TGS#aPAIYFJG2',
				SDKAppID: 0,
				userID: '',
				userSig: '',
				liveWatchUsersNum: 0, // 初始化观看人数
				liveAudienceBase:	0, // int	true	观看人数基础人数
				liveAudienceRate:	1.0, // double	true	观看人数系数
				liveStatus: 1, // 1直播 2回放
				zanNums: 0, // 点赞人数
				userInfo: { // 微信用户信息
					userName: '游客', // 微信昵称
					userAvatar: '' // 微信头像
				},
				giftInfo: {
					enable: true, // 是否开启 true false
					type: 1 // 1 普通礼物 2 红包礼物
				},
				teacherInfo: { // 老师主播信息
					userPic: '', // 头像
					userName: '', // 昵称
					userId: '' // id
				},
				commonConfig: {
					forbiddenTime: 7200, // 禁言时长（单位s，默认值-7200）
					giveLikeRate: 3000, // 点赞间隔（单位ms，默认值-3000）
					sendRate: 500 // 消息发送间隔（单位ms，默认值-500）
				}
			}
		}
	},
	created () {
		this.height = document.body.getBoundingClientRect().height
		this.getUserSign()
	},
	methods: {
		getUserSign () {
			IM.getUserSign({
				openId: getUrlParam('userId')
			}).then(res => {
				this.initData.userID = res.userid
				this.initData.userSig = res.usersign
				this.initData.SDKAppID = res.sdkappid
			}).catch(err => {
				console.log(err)
			})
		},
		sendGift () {
			console.log('sendGift', '横版礼物图标触发事件')
		},
		handleSendGift () {
			this.$refs['current-message'].sendGift({
				'msgInfo': {
					'type': 5,
					'body': {
						'streamId': getUrlParam('streamId'),
						'giftId': '1',
						'giftType': 1, // 礼物类型 1 普通礼物 2 红包礼物
						'imageUrl': 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2162320554,1210926711&fm=26&gp=0.jpg',
						'priceType': 1, // 价格类型 1 掌通币 2 人民币
						'price': 100, // 价格 单位：分
						'priceTxt': '￥1.00', // 价格字符串
						'cnt': 1, // 礼物数量
						'textContent': '鲜花'// 礼物文本提示
					}
				// 'msgInfo': {
				// 	'type': 5,
				// 	'body': {
				// 		'streamId': getUrlParam('streamId'),
				// 		'giftId': '1',
				// 		'giftType': 2, // 礼物类型 1 普通礼物 2 红包礼物
				// 		'imageUrl': 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2162320554,1210926711&fm=26&gp=0.jpg',
				// 		'priceType': 2, // 价格类型 1 掌通币 2 人民币
				// 		'price': 1200, // 价格 单位：分
				// 		'priceTxt': '￥12.00', // 价格字符串
				// 		'cnt': 1, // 礼物数量
				// 		'textContent': '红包'// 礼物文本提示
				// 	}
				// }
				}
			})
		},
		handleClose () {
			console.log('竖版关闭图标触发事件')
		},
		handleOpenApp () {
			console.log('竖版触发引导 demo')
		}
	}

}
</script>
<style lang="scss" scoped>
.im-container {
	width: 100%;
	height: 100%;
	font-size: 30px;
}
.video-placeholder {
	height: 24%;
	width: 100%;
	background-color: #999;
	text-align: center;
	color: #fff;
}
.tabs-row {
	height: 6%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	font-size: 32px;
	border-bottom: 1px solid #eee;
	> div {
		flex: 1;
	}
	.current {
		color: #00AAFF;
	}
}
.tabs-content {
	height: 70%;
	background-color: #eee;
}
</style>
