<template>
	<!-- 竖屏直播 -->
	<div class="vertical-container">
		<div class="video-content">
			<vPlayer v-if="playerOpt.src" :options="playerOpt" ref="player" :vertical="true" :error-code="errorCode" @onError="playError" @onPlay="playStart" @countDownRun="countDownRun" @onPause="playPause" />
			<div class="scroll-box-container">
				<custom-message v-if="initData.userID && isInit" @close="handleClose" :initData="initData" ref="current-message" @openApp="openApp"></custom-message>
			</div>
		</div>
	</div>
</template>
<script>
import vPlayer from '@/components/player/vPlayer'
import CustomMessage from '@/components/im-message/message'
import { WxTools } from '@/utils/wx-conf'
import { LiveApi as Api, IM as ImApi } from '@/api'
import Common from '@/utils/common'
export default {
	data () {
		return {
			tabIndex: 1,
			urlParams: {
				liveId: this.$route.query.liveId
			},
			playerOpt: {
				src: '', // https://bfpro-file.oss-cn-hangzhou.aliyuncs.com/1001120200310170204674BH4cctY5.mp4
				poster: '',
				liveBeginTime: 0,
				liveStatus: 0,
				liveTitle: ''
			},
			liveInfo: {},
			rewardShow: 0,
			reportingTime: 0, // 上报观看时长
			rewardSwitch: 0, // 打赏开关
			vodList: [], // 精彩内容列表
			errorCode: 0,
			desc: '',
			dateNow: Date.now(),
			timer: null,
			isInit: false,
			initData: {
				layout: 'vertical', // 不传默认 horizontal 横版，竖版 vertical
				groupID: '', // 群组ID
				SDKAppID: '', // 云通信应用的 SDKAppID
				userID: '', // 用户ID，这边为微信openid
				userSig: '', // 用户密匙
				liveWatchUsersNum: 0, // 初始化观看人数
				liveAudienceBase:	0, // int	true	观看人数基础人数
				liveAudienceRate:	1.0, // double	true	观看人数系数
				liveStatus: 1, // 1直播 2回放
				userInfo: {
					userName: '',
					userAvatar: ''
				},
				giftInfo: {
					enable: false,
					type: 0
				},
				// 主播信息
				teacherInfo: {
					userPic: '',
					userName: '',
					userId: ''
				}
			},
			liveFlag: false
		}
	},
	components: { vPlayer, CustomMessage },
	computed: {
	},
	created () {
		console.log(Common.getUrl('shopName'), '***************************')
		this.getLiveRoomInfo()
		this.getDesc()
		this.getUserSign()
	},
	beforeMount () {
		// const wxUserInfo = window.localStorage.getItem('wx_user_info')
		// if (!wxUserInfo) {
		// 	WxTools.$emit('closeWindow')
		// }
	},
	mounted () {
		this.$bus.$on('onLivePlayEnd', this.onLivePlayEnd.bind(this))
	},
	methods: {
		async getUserSign () {
			console.log('getUserSign-getUserSign-getUserSign')
			const wxUserInfo = JSON.parse(window.localStorage.getItem('wx_user_info'))
			try {
				const { userid, usersign, sdkappid } = await ImApi.getUserSign({ openId: wxUserInfo.openid })
				this.initData.userID = userid
				this.initData.userSig = usersign
				this.initData.SDKAppID = sdkappid
				this.initData.userInfo = {
					userName: wxUserInfo.nickname,
					userAvatar: wxUserInfo.headimgurl
				}
				window.SDKAppID = sdkappid
				window.tim = this.TIM.create({
					SDKAppID: sdkappid
				})
				this.isInit = true
				let pvParm = {
					platf: 3,
					type: 2,
					livetype: 2
				}
				window.szyreport.reportPV({
					data: {
						'status': '', // 状态--%>
						'trial': '', // 试看(选填)--%>
						'stay_time': '', // 时长(选填)--%>
						'progress': '', // 浏览进度(选填)--%>
						'page_category': '3', // 页面大类(选填)--%>
						'page': 'openclass_main', // 页面(选填)--%>
						'page_id': this.$route.query.liveId, // 页面ID(选填)--%>
						'parm': JSON.stringify(pvParm), // 自定义参数(选填)--%>
						'f_page': '', // 来路页面(选填)--%>
						'f_page_id': '', // 来路页面ID(选填)--%>
						'f_page_location': ''// 来路页面位置(选填)--%>
					}, // 页面报数参数（必填）--%>
					prefix: '' // 测试环境'alpha'，线上环境''（选填）--%>
				})
			} catch (error) {
				console.log(error)
			}
		},
		// 获取直播间信息
		async getLiveRoomInfo (refresh) {
			const { liveId } = this.urlParams
			console.log('获取直播间信息-获取直播间信息-获取直播间信息-获取直播间信息')
			try {
				const { playInfo, vodList, vodlist, reportingTime } = await Api.getLiveRoomInfo({
					liveId,
					shareUrl: window.location.href
				},
				{
					headers: {
						sessionId: ''
					}
				})
				// 播放器相关
				this.playerOpt.liveStatus = playInfo.liveState
				this.playerOpt.src = playInfo.hlsPlayUrl || 'no live'
				this.playerOpt.liveBeginTime = playInfo.liveBeginTime || 0
				this.playerOpt.poster = playInfo.liveBackground
				this.playerOpt.liveTitle = playInfo.liveTitle
				this.$set(this.urlParams, 'streamId', playInfo.streamId)
				this.$set(this.urlParams, 'groupId', playInfo.groupId)
				this.$set(this.urlParams, 'anchorType', playInfo.belongUserType)
				this.$set(this.urlParams, 'anchorId', playInfo.userId)
				this.$set(this.urlParams, 'shopName', playInfo.liveTitle)
				this.initData.groupID = playInfo.groupId
				if (this.playerOpt.liveStatus === 2 || this.playerOpt.liveStatus === 0) {
					if (refresh) {
						this.errorCode = 1
					} else {
						this.errorCode = 2
					}
					this.timer && clearInterval(this.timer)
				} else {
					this.errorCode = 0
				}
				// 直播间信息
				this.vodList = vodList || vodlist
				this.reportingTime = reportingTime
				// this.initData.giftInfo.enable = rewardSwitch * 1 === 1
				// if (giftSwitch * 1 === 1) { // 普通礼物开关
				// 	this.initData.giftInfo.type = 1
				// } else if (redEnvelopeSwitch * 1 === 1) { // 红包礼物开关
				// 	this.initData.giftInfo.type = 2
				// }
				this.initData.zanNums = playInfo.liveThumbsupCount || 0
				this.initData.liveWatchUsersNum = playInfo.liveWatchUsersNum || 0
				this.initData.liveAudienceBase = playInfo.liveAudienceBase || 0
				this.initData.liveAudienceRate = playInfo.liveAudienceRate || 1.0
				this.initData.teacherInfo = {
					userPic: playInfo.userPic,
					userName: playInfo.userName,
					userId: playInfo.userId
				}
				if (!refresh) {
					// 页面标题
					document.title = playInfo.liveTitle
					// 二次分享相关
					WxTools.$emit('setShareData', {
						title: playInfo.liveShareInfo.msgTitle,
						desc: playInfo.liveShareInfo.summary,
						imgUrl: 'http://snsimg.ztjystore.cn/ztnew/ad/img/2020/04/02/1585818851669029.png'
					})
				}
			} catch (error) {
				this.playerOpt.src = 'no live'
				if (error === '直播不存在') {
					this.errorCode = 2
				} else {
					this.errorCode = 3
				}
			}
		},
		// 获取直播间简介
		async getDesc () {
			const { liveId } = this.urlParams
			try {
				const { liveIntroduction: desc } = await Api.getDesc({ liveId })
				this.desc = desc
			} catch (error) {
				console.log(error)
			}
		},
		// 播放出错时
		async playError () {
			await this.getLiveRoomInfo(true)
		},
		// 上报观看时长
		reportTime (watchType = 0, vodId = '0') {
			this.timer && clearInterval(this.timer)
			this.timer = setInterval(async () => {
				const { openid: openId } = JSON.parse(window.localStorage.getItem('wx_user_info'))
				const params = {
					liveId: this.urlParams.liveId,
					watchType,
					terminalType: 2,
					vodId,
					userType: 2,
					openId
				}
				try {
					await Api.reportTime(params)
				} catch (error) {
					console.log(error)
				}
			}, this.reportingTime * 60 * 1000)
		},
		// 上报开始播放状态
		async reportStartPlay (type = 'LIVE', watchType = 0, vodId) {
			const params = {
				liveId: this.urlParams.liveId,
				watchType,
				userType: 2,
				vodId
			}
			try {
				await Api.reportPlayStart(type, params)
			} catch (error) {
				console.log(error)
			}
		},
		// 开始播放
		playStart () {
			// const { liveStatus } = this.playerOpt
			// if (liveStatus < 2 && !this.liveFlag) {
			// 	this.reportStartPlay()
			// 	this.liveFlag = true
			// }
			// 上报时长
			this.reportTime()
		},
		playPause () {
			this.timer && clearInterval(this.timer)
		},
		openApp () {
			this.$dialog.alert({
				message: '可能离开微信，打开第三方应用',
				showCancelButton: true
			}).then(() => {
				console.log('点击了确认按钮噢')
				// let url = window.location.host + '/live/app-guide?liveId=' + Common.gerUrl('liveId') + '&schoolId=' + Common.gerUrl('schoolId') + '&share_f=' + Common.gerUrl('share_f')
				window.location.href = window.location.protocol + '//' + window.location.host + '/bflive/app-guide?liveId=' + Common.getUrl('liveId') + '&schoolId=' + Common.getUrl('schoolId') + '&share_f=' + Common.getUrl('share_f')
				console.log(Common.getUrl('liveId'))
				// window.location.href = url
			}).catch(() => {
				console.log('点击了取消按钮噢2222')
			})
		},
		// 关闭直播页
		handleClose () {
			WxTools.$emit('closeWindow')
			// 关闭页面时退出群组
			window.tim
				.quitGroup(this.urlParams.groupId)
				.catch(() => {
					console.log('applyQuitGroup 错误')
				})
		},
		// 轮询获取播放状态
		async countDownRun () {
			await this.getLiveRoomInfo()
			const { liveStatus } = this.playerOpt
			if (liveStatus === 1) {
				setTimeout(() => {
					window.location.reload()
				}, 30 * 1000)
			}
		},
		// 直播结束
		onLivePlayEnd (msg) {
			if (+msg.state === 0) {
				this.errorCode = 1
				this.$refs.player.player.pause()
				this.playerOpt.liveStatus = 2
				this.timer && clearInterval(this.timer)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.vertical-container {
	width: 100%;
	height: 100%;
	.video-content {
		width: 100%;
		height: 100%;
	}
}
.van-overlay {
	z-index: 200001 !important;
}
.van-dialog {
	z-index: 200002 !important;
}
</style>
