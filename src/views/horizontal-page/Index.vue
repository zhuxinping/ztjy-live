<template>
	<!-- 横屏直播 -->
	<div class="horizontal-container">
		<vPlayer v-if="playerOpt.src" :options="playerOpt" ref="player" :error-code="errorCode" @onError="playError" @onPlay="playStart" @countDownRun="countDownRun" @onPause="playPause" />
		<div class="scroll-box-container">
			<vTabbar :items="tabbarItems" @change="onTabbarChange" />
			<div class="scroll-box-wrapper">
				<keep-alive>
					<component
					:is="componentId"
					:live-introduction="desc"
					:vodlist="vodList"
					:play-info="{livebackground: playerOpt.poster}"
					:initData="imInitData"
					ref="current-message"
					v-if="isInit"
					@toplay="loadVideo"
					@sendGift="setRewardVisible(1)"
					></component>
				</keep-alive>
			</div>
		</div>
		<!-- 打赏组件 -->
		<!-- <reward :rewardShow="rewardShow" :rewardType="2" @setRewardVisible="setRewardVisible" @paySuc="updateIMItem"></reward> -->
		<reward v-if="isInit && imInitData.giftInfo.type && imInitData.giftInfo.enable" :rewardShow="rewardShow" :urlParams="urlParams" :rewardType="imInitData.giftInfo.type" @setRewardVisible="setRewardVisible" @paySuc="updateIMItem"></reward>
		<!-- <div class="reward-fixed" @click="setRewardVisible(1)">打赏</div> -->
	</div>
</template>
<script>
import vPlayer from '@/components/player/vPlayer'
import vTabbar from '@/components/tabbar/vTabbar'
import reward from '@/components/reward/Index'
import Introduce from '@/components/public-com/Introduce'
import VodList from '@/components/public-com/vodList'
import Interactive from '@/components/public-com/Interactive'
import CustomMessage from '@/components/im-message/message'
import { WxTools } from '@/utils/wx-conf'
import { LiveApi as Api, IM as ImApi } from '@/api'
import Common from '@/utils/common'
import defaultPosterHor from '@/assets/images/player/live_default.png'
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
			tabbarItems: [
				{
					label: '互动',
					value: 1
				}, {
					label: '简介',
					value: 2
				}
			],
			dateNow: Date.now(),
			timer: null,
			isInit: false,
			imInitData: {
				layout: 'horizontal', // 不传默认 horizontal 横版，竖版 vertical
				groupID: '', // 群组ID
				SDKAppID: '', // 云通信应用的 SDKAppID
				userID: '', // 用户ID，这边为微信openid
				userSig: '', // 用户密匙
				zanNums: 0,
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
				commonConfig: {
					forbiddenTime: 7200, // 禁言时长（单位s，默认值-7200）
					giveLikeRate: 3000, // 点赞间隔（单位ms，默认值-3000）
					sendRate: 500 // 消息发送间隔（单位ms，默认值-500）
				}
			},
			liveFlag: false
		}
	},
	components: { vPlayer, vTabbar, reward, Introduce, VodList, Interactive, CustomMessage },
	computed: {
		isOld () {
			return Common.versionCompare(this.urlParams.appVer || '6.1.1', '6.24') < 0
		},
		componentId () {
			let name = ''
			switch (this.tabIndex) {
			case 1:
				// name = this.isOld ? 'Interactive' : 'CustomMessage'
				name = 'CustomMessage'
				break
			case 2:
				name = 'Introduce'
				break
			case 3:
				name = 'VodList'
				break
			}
			return name
		}
	},
	async created () {
		await this.getLiveRoomInfo()
		await this.getDesc()
		await this.getUserSign()
		await this.getImConf()
		this.pvShareReport()
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
			const wxUserInfo = JSON.parse(window.localStorage.getItem('wx_user_info'))
			try {
				const { userid, usersign, sdkappid } = await ImApi.getUserSign({ openId: wxUserInfo.openid })
				this.imInitData.userID = userid
				this.imInitData.userSig = usersign
				this.imInitData.SDKAppID = sdkappid
				this.imInitData.userInfo = {
					userName: wxUserInfo.nickname,
					userAvatar: wxUserInfo.headimgurl
				}
				window.SDKAppID = sdkappid
				window.tim = this.TIM.create({
					SDKAppID: sdkappid
				})
				this.isInit = true
			} catch (error) {
				console.log(error)
			}
		},
		// 获取直播间信息
		async getLiveRoomInfo (refresh) {
			const { liveId } = this.urlParams
			const { openid: openId } = JSON.parse(window.localStorage.getItem('wx_user_info'))
			try {
				const { playInfo, vodList, vodlist, reportingTime, rewardSwitch, redEnvelopeSwitch, giftSwitch } = await Api.getLiveRoomInfo({
					liveId,
					shareUrl: window.location.href,
					openId
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
				this.playerOpt.poster = playInfo.liveBackground || defaultPosterHor
				this.playerOpt.liveTitle = playInfo.liveTitle
				this.$set(this.urlParams, 'streamId', playInfo.streamId)
				this.$set(this.urlParams, 'groupId', playInfo.groupId)
				this.$set(this.urlParams, 'anchorType', playInfo.belongUserType)
				this.$set(this.urlParams, 'anchorId', playInfo.userId)
				this.$set(this.urlParams, 'shopName', playInfo.liveTitle)
				this.imInitData.groupID = playInfo.groupId
				if (this.playerOpt.liveStatus === 2) {
					this.errorCode = refresh ? 1 : 2
					this.timer && clearInterval(this.timer)
				} else {
					this.errorCode = 0
				}
				// 直播间信息
				this.vodList = vodList || vodlist
				this.reportingTime = reportingTime
				if (rewardSwitch * 1 === 1 && (giftSwitch * 1 === 1 || redEnvelopeSwitch * 1 === 1)) {
					this.imInitData.giftInfo.enable = true
					if (giftSwitch * 1 === 1) { // 普通礼物开关
						this.imInitData.giftInfo.type = 1
					} else if (redEnvelopeSwitch * 1 === 1) { // 红包礼物开关
						this.imInitData.giftInfo.type = 2
					}
				}
				this.imInitData.zanNums = playInfo.liveThumbsupCount || 0
				this.imInitData.liveWatchUsersNum = playInfo.liveWatchUsersNum || 0
				this.imInitData.liveAudienceBase = playInfo.liveAudienceBase || 0
				this.imInitData.liveAudienceRate = playInfo.liveAudienceRate || 1.0
				if (playInfo.liveState * 1 === 2) {
					this.tabbarItems = [
						{ label: '互动', value: 1 },
						{ label: '简介', value: 2 },
						{ label: '精彩内容', value: 3 }
					]
					if (this.vodList.length) {
						this.imInitData.liveStatus = 2
						setTimeout(() => {
							const item = this.vodList[0]
							this.loadVideo({ item }, true)
						}, 50)
					}
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
		updateIMItem (data) {
			console.log(data)
			this.$refs['current-message'].sendGift({ msgInfo: data.msgInfo })
		},
		onTabbarChange (value) {
			this.tabIndex = value
			switch (value) {
			case 1:
				this.pvShareReport()
				break
			case 2:
				this.pvShareReport('introduction')
				break
			case 3:
				this.pvShareReport('video')
				break
			}
		},
		// 点击IM礼物按钮
		setRewardVisible (visible, isChild) {
			this.rewardShow = visible
			let eventWords = this.imInitData.giftInfo.type === 1 ? 'gift' : 'redpacket'
			// pv报数
			let pvParm = {
				fromtype: 3,
				type: 2,
				livetype: 1
			}
			if (isChild) {
				return false
			}
			// alert('isChild=' + isChild + '   visible=' + visible)
			window.szyreport.reportPV({
				data: {
					'status': '', // 状态--%>
					'trial': '', // 试看(选填)--%>
					'stay_time': '', // 时长(选填)--%>
					'progress': '', // 浏览进度(选填)--%>
					'page_category': '3', // 页面大类(选填)--%>
					'page': 'openclass_main', // 页面(选填)--%>
					'page_id': '', // 页面ID(选填)--%>
					'parm': JSON.stringify(pvParm), // 自定义参数(选填)--%>
					'f_page': '', // 来路页面(选填)--%>
					'f_page_id': '', // 来路页面ID(选填)--%>
					'f_page_location': eventWords// 来路页面位置(选填)--%>
				}, // 页面报数参数（必填）--%>
				prefix: '' // 测试环境'alpha'，线上环境''（选填）--%>
			})
			this.$szyreport.reportEvent({
				data: {
					event_id: 'click_openclass_' + eventWords,
					obj_id: Common.getUrl('liveId'),
					parm: {
						client: 3
					}
				},
				prefix: ''
			})
		},
		// 精彩内容点播
		loadVideo ({ item }, flag) {
			const src = item.playUrl || item.playurl
			this.$nextTick(() => {
				this.$refs.player.player.load(src.replace('http:', 'https:'))
				flag !== true && this.$refs.player.player.play()
				const timer = setTimeout(() => {
					this.$refs.player.isError = false
					clearTimeout(timer)
				}, 100)
				this.reportStartPlay('VIDEO', 1, item.vodId || item.vodid)
				this.reportTime(1, item.vodId || item.vodid)
			})
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
		// pv报数
		pvShareReport (f_page_location = 'livechat') {
			const { liveId } = this.urlParams
			let url = window.location.origin
			const prefix = url.includes('alpha') || url.includes('dev') ? 'alpha' : ''
			window.szyreport.reportPV({
				data: {
					page_category: 3,
					page: 'openclass_main',
					page_id: liveId,
					parm: JSON.stringify({
						platf: '3',
						type: '2',
						livetype: '1'
					}),
					f_page_location
				},
				prefix
			})
		},
		// 获取直播间im配置信息
		async getImConf () {
			try {
				const { configInfo } = await Api.getImConf()
				Object.assign(this.imInitData.commonConfig, configInfo)
			} catch (error) {
				console.log(error)
			}
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
				this.playerOpt.liveStatus = 2
				this.$refs.player.player.pause()
				this.timer && clearInterval(this.timer)
			}
		}
	}
}
</script>
<style lang="scss">
	.horizontal-container {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-flow: column;
		.scroll-box-container {
			flex: 1;
			display: flex;
			flex-flow: column;
			flex-shrink: 0;
			overflow: hidden;
		}
		.scroll-box-wrapper {
			flex: 1;
			width: 100%;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
		}
	}
	.reward-fixed {
		position: fixed;
		right: 160px;
		bottom: 100px;
		width: 100px;
		height: 100px;
		background: pink;
		line-height: 100px;
		text-align: center;
		z-index: 99;
	}
</style>
