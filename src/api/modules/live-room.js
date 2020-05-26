import { API } from '../api'
import { xmpath, path } from '../apiHost'

export const LIVE_API = {
	// 获取直播间信息
	ROOM_INFO: xmpath('/live/getLivePlayInfo/v1.0'),

	// 获取礼物列表
	REWARD_LIST: path('/gift/shop/gift/list/v1.0'),
	// REWARD_LIST: 'https://alpha-api.szy.cn' + ('/gift/shop/gift/list/v1.0'),

	// 创建预支付订单
	REWARD_ORDER: path('/gift/shop/gift/reward/v1.0'),
	// REWARD_ORDER: 'https://alpha-api.szy.cn' + ('/gift/shop/gift/reward/v1.0'),

	// 查询订单状态
	REWARD_ORDER_STATUS: path('/gift/order/status/get/v1.0'),
	// REWARD_ORDER_STATUS: 'https://alpha-api.szy.cn' + ('/gift/order/status/get/v1.0'),

	// 获取直播简介
	GET_DESC: xmpath('/live/reloadLiveIntroduction/v1.0'),

	// 上报观看时长
	REPORT_TIME: xmpath('/live/updateWatchTimes/v1.0'),

	// 开始播放上报
	START_PLAY: {
		// 直播
		LIVE: xmpath('/live/startWatch/v1.0'),
		// 视频
		VIDEO: xmpath('/live/startWatchVod/v1.0')
	},
	// 获取直播间发言配置
	IM_CONF: xmpath('/live/web/commonConfig/140017/v1.0')
}

export default {
	// 获取直播间配置
	getLiveRoomInfo (params, conf) {
		return API.post(LIVE_API.ROOM_INFO, params, conf)
	},
	// 获取礼物列表
	getRewardList (params, conf) {
		return API.post(LIVE_API.REWARD_LIST, params, conf)
	},
	// 创建预支付订单
	getRewardOrder (params, conf) {
		return API.post(LIVE_API.REWARD_ORDER, params, conf)
	},
	// 查询订单状态
	QuertRewardOrderStatus (params, conf) {
		return API.post(LIVE_API.REWARD_ORDER_STATUS, params, conf)
	},
	// 获取直播间简介
	getDesc (params, conf) {
		return API.post(LIVE_API.GET_DESC, params, conf)
	},
	// 上报观看时长
	reportTime (params, conf) {
		return API.post(LIVE_API.REPORT_TIME, params, conf)
	},
	// 上报开始播放和开始视频播放
	reportPlayStart (type, params, conf) {
		return API.post(LIVE_API.START_PLAY[type], params, conf)
	},
	// 获取直播间im配置
	getImConf (params = {}, conf = {}) {
		return API.post(LIVE_API.IM_CONF, params, conf)
	}
}
