<template>
	<div class="im-component-container">
		<template v-if="initData.layout === 'horizontal'">
			<div class="c-message-main" ref="im-message-list" @scroll="handleScroll">
				<div class="enter-tips" v-show="tipsInited">{{enterTips}}</div>
				<div class="new-msg-tips" v-show="isShowScrollButtomTips" @click="scrollMessageListToBottom">底部有新消息</div>
				<div class="view-people" v-if="initData.liveStatus === 1">观看人数:{{visitsNums | numFormat}}</div>
				<message-item v-for="message in currentMessageList" :key="message.ID" :layout="initData.layout" :message="message" />
			</div>
			<message-input :initData="initData" :sendStatus="sendStatus" @sendMessage="sendMessage" @sendGift="sendGift"></message-input>
			<div class="c-interaction" :class="{horizontal: initData.layout === 'horizontal'}">
				<img class="zan-animation" :class="{show: zanStatus}" src="./img/zan-animation.gif" alt="zan-animation">
				<span class="zan-num" v-show="zanNums">{{zanNums | numFormat}}</span>
				<img class="icon-zan-shadow" v-show="!zanSecnods" :src="zanStatus ? iconZanAdd: iconZan" alt="zan" @click="handleZan">
				<div class="icon-zan-shadow seconds" v-show="zanSecnods"><span class="num">{{zanSecnods/1000}}s</span></div>
			</div>
		</template>

		<template v-else>
			<div class="message-show-main" ref="im-message-show-main" @touchstart='handleTouchStart' @touchmove='handleTouchMove'>
				<div class="new-msg-tips" v-show="isShowScrollButtomTips" @click="scrollMessageListToBottom">底部有新消息</div>
				<div class="c-message-main-vertical" :style="transformX">
					<div class="c-message-enter-tips"></div>
					<div class="c-message-item" ref="im-message-list" :class="{pt0: currentMessageList.length > 4}" @scroll="handleScroll">
						<message-item v-for="message in currentMessageList" :key="message.ID" :enterTips="enterTips" :isEnterMsg="isEnterMsg(message)" :layout="initData.layout" :message="message" />
					</div>
				</div>
				<message-input :initData="initData" @openAppClick="handleOpenApp"></message-input>
			</div>
			<div class="v-top-infos">
				<div class="anchor">
					<img class="pic" :src="initData.teacherInfo.userPic || defaultAvatar" alt="userPic">
					<span class="name">{{initData.teacherInfo.userName || '主播老师'}}</span>
				</div>
				<div class="r-info">
					<div class="visits">观看人数:{{visitsNums | numFormat}}</div>
					<div class="icon-close" @click="handleClose"></div>
				</div>
			</div>
			<div class="c-interaction" @click="handleOpenApp">
				<span class="zan-num mb" v-show="zanNums">{{zanNums | numFormat}}</span>
				<img class="icon-zan" src="./img/icon-zan.png" alt="zan">
				<!-- <img class="icon-gift" src="./img/icon-gift.png" alt="gift"> -->
				<img class="icon-share" src="./img/icon-share.png" alt="share">
			</div>
		</template>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import { Common, IM } from '@/api/index'
import MessageItem from './message-item'
import MessageInput from './message-input'
import { getUrlParam } from 'szyutils'
let url = window.location.origin
let zanInterval = null
let zanTimeout = null
const prefix = url.includes('alpha') || url.includes('dev') ? 'alpha' : ''
export default {
	name: 'CustomMessage', // 自定义消息组件
	props: {
		initData: {
			type: Object,
			required: true
		}
	},
	components: {
		MessageItem,
		MessageInput
	},
	data () {
		return {
			isShowScrollButtomTips: false,
			preScrollHeight: 0,
			tipsInited: false,
			iconZan: require('./img/icon-zan-shadow.png'),
			iconZanAdd: require('./img/icon-zan-add-shadow.png'),
			defaultAvatar: require('./img/icon-avatar.png'),
			imVisitsNums: 0, // IM 人数
			zanNums: this.initData.zanNums || 0, // 点赞人数
			zanStatus: false, // 点赞状态
			sendStatus: false, // 发送状态
			forbidStatus: false, // 禁言状态
			commonConfig: this.initData.commonConfig, // 通用配置
			zanSecnods: 0, // 点赞秒数
			enterTips: '欢迎来到直播间！掌通家园提倡文明交 流，共同打造和谐健康的氛围，任何传播 违法、违规、低俗等不良信息的行为都将 会被严肃处理，请珍惜自己的账号。',
			transformX: { transform: 'translate3d(0, 0, 0)' }, // touch 滑动
			offset: 0
		}
	},
	computed: {
		...mapState({
			currentConversation: state => state.conversation.currentConversation,
			currentMessageList: state => state.conversation.currentMessageList,
			isCompleted: state => state.conversation.isCompleted,
			isSDKReady: state => state.user.isSDKReady,
			userID: state => state.user.userID
		}),
		// 是否显示 Loading 状态
		showLoading () {
			return !this.isSDKReady
		},
		visitsNums () {
			return this.initData.liveAudienceBase + Math.floor((this.imVisitsNums + this.initData.liveWatchUsersNum) * this.initData.liveAudienceRate) // 观看人数
		}
	},
	created () {
		// 初始化IM
		window.tim = this.TIM.create({
			SDKAppID: this.initData.SDKAppID
		})
		window.tim.setLogLevel(1)
	},
	mounted () {
		window.onbeforeunload = e => {
			console.log('applyQuitGroup 触发')
			this.applyQuitGroup(this.initData.groupID)
		}
		this.$bus.$on('im-scroll-bottom', this.scrollMessageListToBottom)
		this.initData && this.initUser()
		this.getDocument()
		this.offset = this.$refs['im-message-show-main'] && this.$refs['im-message-show-main'].getBoundingClientRect().width
	},
	updated () {
		this.keepMessageListOnButtom()
	},
	filters: {
		// 数量格式化
		numFormat (num) {
			if (num > 10000) {
				const strNum = `${num}`
				return `${strNum.substring(0, strNum.length - 4)}.${Number(strNum.substring(strNum.length - 4, strNum.length - 3)) + (strNum.substring(strNum.length - 3, strNum.length - 2) > 4 ? 1 : 0)}万`
			} else {
				return num
			}
		}
	},
	methods: {
		getDocument () {
			Common.getDocument({
				schoolId: '',
				positionKeys: 'ZB-A0007,ZB-A0008,ZB-A0009'
			}).then(res => {
				this.enterTips = res['ZB-A0007']
				localStorage.setItem('copyright', JSON.stringify(res))
				this.tipsInited = true
				let seconds = 5
				let interval = setInterval(() => {
					seconds--
					if (seconds === 0) {
						clearInterval(interval)
						this.tipsInited = false
					}
				}, 1000)
			}).catch(err => {
				console.log('getDocument', err)
			})
		},
		initUser () {
			window.tim
				.login({
					userID: this.initData.userID,
					userSig: this.initData.userSig
				})
				.then(() => {
					this.loading = false
					// 初始化监听器
					this.initListener()
					this.$store.commit('toggleIsLogin', true)
					this.$store.commit('startComputeCurrent')
					this.applyJoinGroup(this.initData.groupID)
					this.$store.commit({
						type: 'GET_USER_INFO',
						userID: this.initData.userID,
						userSig: this.initData.userSig,
						sdkAppID: this.initData.SDKAppID
					})
					this.$store.commit('showMessage', {
						type: 'success',
						message: '登录成功'
					})
				})
				.catch(error => {
					this.loading = false
					this.$store.commit('showMessage', {
						message: '登录失败：' + error.message,
						type: 'error'
					})
				})
		},
		initListener () {
			// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
			window.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this)
			// SDK NOT READT
			window.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this)
			// 被踢出
			window.tim.on(this.TIM.EVENT.KICKED_OUT, this.onKickOut)
			// SDK内部出错
			window.tim.on(this.TIM.EVENT.ERROR, this.onError)
			// 收到新消息
			window.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage)
			// 会话列表更新
			window.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onUpdateConversationList)
			// 群组列表更新
			window.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList)
			// 收到新的群系统通知
			window.tim.on(this.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onReceiveGroupSystemNotice)
		},
		onReceiveMessage ({ data: messageList }) {
			this.handleQuitGroupTip(messageList)
			this.$store.commit('pushCurrentMessageList', messageList)
			if (messageList.length > 0) {
				messageList.map(item => {
					if (this.isJSON(item.payload.data)) {
						const objData = JSON.parse(item.payload.data)
						if (objData.businessInfo.type === 2) { // 业务消息类型
							switch (objData.msgInfo.type) {
							case 1: // 点赞消息
								this.zanNums++
								break
							case 2: // 用户进出
								if (objData.msgInfo.body.joinType === 1) { // 进入
									this.imVisitsNums++
								} else {
									this.imVisitsNums--
								}
								break
							default:
								break
							}
						}
					}
				})
			}
		},
		sendGift (data) {
			this.$emit('sendGift')
			if (!data) return
			const msgData = data.msgInfo.body
			const text = msgData.giftType === 1 ? `${msgData.textContent}+${msgData.cnt}` : `红包${(msgData.price / 100).toFixed(2)}元`
			data.msgInfo.body.textContent = '送给老师 ' + text
			this.sendBusinessMsg(data)
		},
		handleZan () {
			if (this.zanStatus) {
				return
			}
			this.zanStatus = true
			const objData = {
				'msgInfo': {
					'type': 1,
					'body': {
						'streamId': getUrlParam('streamId'),
						'vodId': getUrlParam('vodId'),
						'cnt': 1,
						'tip': '给老师点赞'
					}
				}
			}
			this.sendBusinessMsg(objData)
			zanTimeout = setTimeout(() => {
				this.zanSecnods = this.commonConfig.giveLikeRate // ms
				const time = 1000 // 定时器间隔 ms
				zanInterval = setInterval(() => {
					this.zanSecnods = this.zanSecnods - time
					if (this.zanSecnods <= 0) {
						clearInterval(zanInterval)
						this.zanStatus = false
					}
				}, time)
			}, 500)
			this.$szyreport.reportEvent({
				data: {
					event_id: 'click_openclass_imlike',
					obj_id: getUrlParam('liveId'),
					parm: {
						client: 3,
						livetype: this.initData.layout === 'horizontal' ? 1 : 2
					}
				},
				prefix
			})
		},
		handleUserStatusNotice (type) {
			// console.log('handleUserStatusNotice', `${type === 1 ? '加入' : '退出'}了直播`)
			const objData = {
				'msgInfo': {
					'type': 2,
					'body': {
						'streamId': getUrlParam('streamId'),
						'joinType': type, // 类型，取值：1加入直播，2退出直播
						'joinTip': `${this.initData.userInfo.userName}${type === 1 ? '加入' : '退出'}了直播`
					}
				}
			}
			this.sendBusinessMsg(objData)
		},
		sendBusinessMsg (inputData) {
			const dataObj = {
				'clientInfo': {
					'type': 3,
					'version': getUrlParam('appVer')
				},
				'senderInfo': {
					'schoolId': getUrlParam('schoolId'),
					'userType': 0,
					'userId': this.initData.userID,
					'userName': this.initData.userInfo.userName,
					'userAvatar': this.initData.userInfo.userAvatar
				},
				'businessInfo': {
					'id': 3, // 1:消息  2:推送 3:直播 4:未读数
					'type': 2 // 1:聊天消息  2:业务消息
				}
			}
			Object.assign(dataObj, inputData)
			IM.sendBusinessMsg({
				groupId: this.initData.groupID,
				msgBody: [
					{
						msgType: 'TIMCustomElem',
						msgContent: {
							data: JSON.stringify(dataObj)
						}
					}
				],
				fromAccount: this.initData.userID
			}).catch(err => {
				console.log('err', err.message)
				clearTimeout(zanTimeout)
				clearInterval(zanInterval)
				this.zanSecnods = 0
				this.zanStatus = false
				this.$toast('网络可能不给力，请稍后再试哦~')
			})
		},
		sendMessage (inputMsg) {
			if (this.sendStatus) {
				this.$toast('正在发送，请稍后片刻')
				return
			}
			let seconds = this.commonConfig.sendRate // ms
			const time = 500 // 定时器间隔 ms
			this.sendStatus = true
			let timeout = seconds ? setInterval(() => {
				seconds = seconds - time
				if (seconds <= 0) {
					clearInterval(timeout)
					this.sendStatus = false
				}
			}, time) : null
			let inputData = {}
			if (inputMsg.type) { // 文本输入
				if (!inputMsg.data) return
				inputData = {
					// 1-1 文字消息
					'msgInfo': {
						'type': 1,
						'body': {
							'textContent': inputMsg.data,
							'streamId': getUrlParam('streamId')
						}
					},
					'businessInfo': {
						'id': 3, // 1:消息  2:推送 3:直播 4:未读数
						'type': 1 // 1:聊天消息  2:业务消息
					}
				}
			}

			const dataObj = {
				'clientInfo': {
					'type': 3,
					'version': getUrlParam('appVer')
				},
				'senderInfo': {
					'schoolId': getUrlParam('schoolId'),
					'userType': 0,
					'userId': this.initData.userID,
					'userName': this.initData.userInfo.userName,
					'userAvatar': this.initData.userInfo.userAvatar
				},
				'businessInfo': {
					'id': 3, // 1:消息  2:推送 3:直播 4:未读数
					'type': 1 // 1:聊天消息  2:业务消息
				}
			}
			Object.assign(dataObj, inputData)
			// console.log('createCustomMessage', dataObj)
			const message = window.tim.createCustomMessage({
				to: this.initData.groupID,
				conversationType: this.TIM.TYPES.CONV_GROUP,
				payload: {
					data: JSON.stringify(dataObj),
					description: '公开课',
					extension: ''
				}
			})
			this.$store.commit('pushCurrentMessageList', message)
			this.$bus.$emit('im-scroll-bottom')
			window.tim.sendMessage(message).catch(error => {
				if (error.code && Number(error.code) === 10016) {
					this.$store.commit('pushCurrentMessageList', {
						'local': true,
						'type': 'TIMCustomElem',
						'conversationID': this.currentConversation.conversationID,
						'payload': {
							'data': { 'type': 'forbid-msg-tip' }
						}
					})
				}
				error.message && error.message.indexOf('Network') > -1 && this.$toast('网络可能不给力，请稍后再试哦~')
			})
		},
		applyJoinGroup (groupID) {
			window.tim
				.joinGroup({ groupID })
				.then(async res => {
					switch (res.data.status) {
					case this.TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
						this.$store.commit('showMessage', {
							message: '申请成功，等待群管理员确认。',
							type: 'info'
						})
						break
					case this.TIM.TYPES.JOIN_STATUS_SUCCESS:
						await this.$store.dispatch(
							'checkoutConversation',
							`GROUP${res.data.group.groupID}`
						)
						this.handleUserStatusNotice(1)
						this.$store.commit('showMessage', {
							message: '加群成功',
							type: 'success'
						})
						break
					case this.TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:
						this.$store.commit('showMessage', {
							message: '您已经是群成员了，请勿重复加群哦！',
							type: 'info'
						})
						break
					default: break
					}
				})
				.catch(error => {
					this.$store.commit('showMessage', {
						message: error.message,
						type: 'error'
					})
				})
		},
		applyQuitGroup (groupID) {
			console.log('applyQuitGroup 执行函数', groupID)
			this.handleUserStatusNotice(2)
			window.tim
				.quitGroup(groupID)
				.catch(() => {
					console.log('applyQuitGroup 错误')
				})
		},
		handleOpenApp () {
			this.$emit('openApp')
		},
		onError ({ data }) {
			if (data.message !== 'Network Error') {
				this.$store.commit('showMessage', {
					message: data.message,
					type: 'error'
				})
			}
		},
		onReadyStateUpdate ({ name }) {
			const isSDKReady = name === this.TIM.EVENT.SDK_READY
			this.$store.commit('toggleIsSDKReady', isSDKReady)

			if (isSDKReady) {
				window.tim
					.getMyProfile()
					.then(({ data }) => {
						this.$store.commit('updateCurrentUserProfile', data)
					})
					.catch(error => {
						this.$store.commit('showMessage', {
							type: 'error',
							message: error.message
						})
					})
				this.$store.dispatch('checkoutConversation', `GROUP${this.initData.groupID}`)
				this.$store.dispatch('getBlacklist')
			}
		},
		kickedOutReason (type) {
			this.handleUserStatusNotice(2)
			switch (type) {
			case this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
				return '由于多实例登录'
			case this.TIM.TYPES.KICKED_OUT_MULT_DEVICE:
				return '由于多设备登录'
			case this.TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
				return '由于 userSig 过期'
			default:
				return ''
			}
		},
		onKickOut (event) {
			this.handleUserStatusNotice(2)
			this.$store.commit('showMessage', {
				message: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
				type: 'error'
			})
			this.$store.commit('toggleIsLogin', false)
			this.$store.commit('reset')
		},
		onUpdateConversationList (event) {
			this.$store.commit('updateConversationList', event.data)
		},
		onUpdateGroupList (event) {
			this.$store.commit('updateGroupList', event.data)
		},
		onReceiveGroupSystemNotice (event) {
			const isKickedout = event.data.type === 4
			const isCurrentConversation =
        `GROUP${event.data.message.payload.groupProfile.groupID}` ===
        this.currentConversation.conversationID
			// 在当前会话被踢，需reset当前会话
			if (isKickedout && isCurrentConversation) {
				this.$store.commit('resetCurrentConversation')
			}
		},
		/**
     * 收到有群成员退群/被踢出的groupTip时，需要将相关群成员从当前会话的群成员列表中移除
     * @param {Message[]} messageList
     */
		handleQuitGroupTip (messageList) {
			// 筛选出当前会话的退群/被踢群的 groupTip
			const groupTips = messageList.filter(message => {
				return this.currentConversation.conversationID === message.conversationID &&
          message.type === this.TIM.TYPES.MSG_GRP_TIP &&
          (message.payload.operationType === this.TIM.TYPES.GRP_TIP_MBR_QUIT ||
          message.payload.operationType === this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT)
			})
			// 清理当前会话的群成员列表
			if (groupTips.length > 0) {
				groupTips.forEach(groupTip => {
					if (Array.isArray(groupTip.payload.userIDList) || groupTip.payload.userIDList.length > 0) {
						this.$store.commit('deleteGroupMemberList', groupTip.payload.userIDList)
					}
				})
			}
		},
		// 如果滚到底部就保持在底部，否则提示是否要滚到底部
		keepMessageListOnButtom () {
			let messageListNode = this.$refs['im-message-list']
			if (!messageListNode) {
				return
			}
			// 距离底部20px内强制滚到底部,否则提示有新消息
			if (this.preScrollHeight - messageListNode.clientHeight - messageListNode.scrollTop < 20) {
				this.$nextTick(() => {
					messageListNode.scrollTop = messageListNode.scrollHeight
				})
				this.isShowScrollButtomTips = false
			} else {
				this.isShowScrollButtomTips = true
			}
			this.preScrollHeight = messageListNode.scrollHeight
		},
		// 直接滚到底部
		scrollMessageListToBottom () {
			this.$nextTick(() => {
				let messageListNode = this.$refs['im-message-list']
				if (!messageListNode) {
					return
				}
				messageListNode.scrollTop = messageListNode.scrollHeight
				this.preScrollHeight = messageListNode.scrollHeight
				this.isShowScrollButtomTips = false
			})
		},
		// 检测滚动
		handleScroll (e) {
			// console.log('滚动的像素+容器的高度', e.srcElement.scrollTop + e.srcElement.offsetHeight, '可滚动的总高度', e.srcElement.scrollHeight)
			if (e.srcElement.scrollTop + e.srcElement.offsetHeight === e.srcElement.scrollHeight) {
				this.isShowScrollButtomTips = false
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
		},
		handleClose () {
			this.$emit('close')
		},
		// touch事件
		handleTouchStart (e) {
			this.pageX = e.pageX || e.touches[0].pageX
		},
		handleTouchMove (e) {
			const mv = e.pageX || e.touches[0].pageX
			if (mv - this.pageX < -100) {
				this.transformX = { transform: `translate3d(-${this.offset}px, 0, 0)` }
			} else if (mv - this.pageX > 100) {
				this.transformX = { transform: `translate3d(0, 0, 0)` }
			}
		},
		// 是否是进入信息
		isEnterMsg (msg) {
			if (!msg.payload || typeof msg.payload !== 'object') {
				return false
			}
			const data = msg.payload.data
			if (typeof data === 'object') {
				return data.businessInfo && data.businessInfo.type === 2 && data.msgInfo.body.joinType === 1
			} else if (this.isJSON(data)) {
				const obj = JSON.parse(data)
				return obj.businessInfo && obj.businessInfo.type === 2 && obj.msgInfo.body.joinType === 1
			} else {
				return false
			}
		}
	},
	beforeDestroy () { // 页面关闭时退出群
		console.log('beforeDestroy')
		this.applyQuitGroup(this.initData.groupID)
	}
}
</script>
<style lang="scss" scoped>
.im-component-container {
	font-size: 30px;
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
	::-webkit-scrollbar {
		background: none;
		width: 0px;
		height: 0px;
	}
	.message-show-main {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		.new-msg-tips {
			color: #FF5E68;
			font-size: 22px;
			text-align: center;
			width: 178px;
			height: 60px;
			line-height: 60px;
			border-radius: 999px;
			background-color: #fff;
			box-shadow: 0 0 10px #ccc;
			position: fixed;
			bottom: 120px;
			left: 20px;
			z-index: 1;
		}
	}
	.mask {
    height: 60px;
    width: 100%;
		// background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3) );
		background-position: center;
		background-blend-mode: normal;
    position: absolute;
    left: 0;
    top: -30px;
		z-index: 99;
		margin-left: 20px;
  }
	.c-message-main-vertical {
		height: 500px;
		max-height: 500px;
		width: 440px;
		max-width: 440px;
		background-color: transparent;
		transition-duration: .6s;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		.c-message-enter-tips {
			height: 90px;
			width: 100%;
			flex-shrink: 0;
		}
		.c-message-item {
			flex: 1;
			overflow-y: scroll;
			-webkit-overflow-scrolling: touch;
			padding-bottom: 20px;
			padding-top: 390px;
			&.pt0 {
				padding-top: 0;
			}
		}
	}
	.c-message-main {
		flex: 1;
		background-color: #fff;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 20px;
		.enter-tips {
			font-size: 26px;
			padding: 15px;
			color: #E29234;
			background-color: #FDFCEC;
			margin-bottom: 26px;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			box-sizing: border-box;
			z-index: 10;
		}
		.view-people {
			position: fixed;
			margin-top: 14px;
			right: 0;
			box-sizing: border-box;
			z-index: 1;
			border-radius: 30px 0 0 30px;
			background-color: rgba(0,0,0,.4);
			height: 60px;
			line-height: 60px;
			color: #fff;
			font-size: 24px;
			padding: 0 10px 0 24px;
		}
		.new-msg-tips {
			color: #FF5E68;
			font-size: 22px;
			text-align: center;
			width: 178px;
			height: 60px;
			line-height: 60px;
			border-radius: 999px;
			background-color: #fff;
			box-shadow: 0 0 10px #ccc;
			position: fixed;
			bottom: 120px;
			left: 50%;
			margin-left: -84px;
			z-index: 1;
		}
	}
	.c-input-main {
		background-color: #F2F3F5;
		height: 100px;
		width: 100%;
		flex-shrink: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		box-sizing: border-box;
	}
	.c-input-item {
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
	}
	.c-input {
		height: 70px;
		width: 600px;
		line-height: 70px;
		font-size: 26px;
		padding: 10px 10px 10px 25px;
		box-sizing: border-box;
		border-radius: 10px;
		border: 0;
		outline: 0;
	}
	.c-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 100px;
		height: 50px;
		border-radius: 10px;
		background-color: #00AAFF;
		color: #fff;
		font-size:24px;
		border: 0;
		outline: 0;
		&[disabled] {
			background-color: #CCCCCC;
		}
	}
	.icon-gift {
		width: 70px;
		height: 70px;
		border-radius: 50%;
	}

	.c-interaction {
		position: fixed;
		right: 20px;
		bottom: 74px;
		display: flex;
		flex-direction: column;
		z-index: 100;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
		&.horizontal {
			right: 5px;
			bottom: 100px;
			text-align: center;
			justify-content: center;
			align-items: center;
			width: 103px;
		}
		.icon-zan {
			width: 80px;
			height: 80px;
			vertical-align: middle;
			margin-bottom: 26px;
		}
		.icon-gift {
			width: 80px;
			height: 80px;
			vertical-align: middle;
			margin-bottom: 26px;
		}
		.icon-share {
			width: 80px;
			height: 80px;
			vertical-align: middle;
			margin-bottom: 26px;
		}
		// 横版
		.zan-animation {
			width: 120px;
			height: 130px;
			display: none;
			&.show {
				display: block;
			}
		}
		.zan-num {
			width: 80px;
			height: 34px;
			line-height: 34px;
			text-align: center;
			color: #fff;
			background-color: rgba(51,51,51,.4);;
			border-radius: 999px;
			font-size: 22px;
			display: flex;
			justify-content: center;
			align-items: center;
			&.mb {
				margin-bottom: 10px;
			}
		}
		.icon-zan-shadow {
			width: 103px;
			height: 103px;
			vertical-align: middle;
			margin-bottom: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			&.seconds {
				background: url('./img/icon-zan-shadow-bg.png') center/cover no-repeat;
				color: #fff;
				font-size: 28px;
				font-weight: bold;
				.num {
					margin-bottom: 10px;
				}
			}
		}
	}
}
.v-top-infos {
	position: fixed;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #fff;
	font-size: 26px;
	top: 40px;
	left: 0;
	width: 100%;
	height: 60px;
	box-sizing: border-box;
	padding: 0 30px 0 20px;
	z-index: 99999;
	.anchor {
		height: 60px;
		line-height: 60px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		background-color: rgba(0,0,0,.3);
	}
	.pic {
		display: block;
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.name {
		padding: 0 25px 0 20px;
		max-width: 230px;
		box-sizing: border-box;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.r-info {
		display: flex;
		align-items: center;
		text-align: right;
	}
	.visits {
		background-color: rgba(0,0,0,.3);
		padding: 0 25px;
		height: 60px;
		line-height: 60px;
		border-radius: 999px;
		margin-right: 22px;
	}
	.icon-close {
		width: 60px;
		height: 60px;
		vertical-align: middle;
		background: url('./img/icon-close.png') center/cover no-repeat;
	}
}
</style>
