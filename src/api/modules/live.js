import { API } from '../api'
import { path, xmpath } from '../apiHost'

// 接口地址
export const LIVE_API_URL = {
	GETCOMMENTPAGEPARAM: xmpath('/live/getCommentPageParam/v1.0'), // 获取公共参数
	GETCOMMONCONFIGURL: xmpath('/live/web/commonConfig/140017/v1.0'), // 获取公共的接口URL地址
	GETUSERLIVELIST: xmpath('/live/user/getUserLiveList/v1.0'), // 获取公开课列表
	LIVEINTRODUCTION: xmpath('/live/reloadLiveIntroduction/v1.0'), // 获取简介内容
	GETCOMMENTLIST: xmpath('/live/interactive/commentList/v1.0'), // 获取评论列表
	ADDCOMMENT: path('/commentserver/comment/sensitiveadd/v3'), // 新增评论
	DELETECOMMENT: path('/commentserver/comment/delete/v1'), // 删除评论
	LIKESTATE: path('/commentserver/comment/like/v1'), // 点赞获取取消点赞
	STARTWATCHVOD: path('/live/startWatchVod/v1.0') // 上报视频统计
}
// api请求方法定义
export default {
	// 进入互动页面获取参数
	async getCommentPageParam (params, conf) {
		// let json = { 'returncode': '10000', 'message': '获得直播列表数据成功', 'body': { 'source': 'aaa', 'liveid': '121', 'liveaudiences': '12', 'createusertype': '1', 'createuserid': '2' } }
		// return new Promise((resolve, reject) => {
		// 	resolve(json)
		// })
		return await API.post(LIVE_API_URL.GETCOMMENTPAGEPARAM, params, conf)
	},
	// 获取统一地址配置
	async getCommonConfigUrl (params, conf) {
		return await API.post(LIVE_API_URL.GETCOMMONCONFIGURL, params, conf)
	},
	// 获取公开课列表数据

	async getUserLiveList (params, conf) {
		return await API.xm_post(LIVE_API_URL.GETUSERLIVELIST, params, conf)
	},

	// 获取直播简介

	async liveIntroduction (params, conf) {
		return await API.post(LIVE_API_URL.LIVEINTRODUCTION, params, conf)
	},
	// 获取互动留言列表

	async getCommentList (params, conf) {
		return await API.post(LIVE_API_URL.GETCOMMENTLIST, params, conf)
	},
	// 评论留言

	async addComment (params, conf) {
		return await API.post(LIVE_API_URL.ADDCOMMENT, params, conf)
	},
	// 删除评论

	async deleteComment (params, conf) {
		return await API.post(LIVE_API_URL.DELETECOMMENT, params, conf)
	},

	// 点赞取消点赞

	async likeState (params, conf) {
		return await API.post(LIVE_API_URL.LIKESTATE, params, conf)
	},
	// 上报视频统计接口
	async startWatchVod (params, conf) {
		return await API.post(LIVE_API_URL.STARTWATCHVOD, params, conf)
	}
}
