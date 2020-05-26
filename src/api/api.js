import Axios from 'axios'
import { namespace, jsToClient } from '@/utils/client'
const Ajax = Axios.create({
	timeout: 6000,
	headers: {
		'Content-Type': 'application/json'
	}
})

let isExistUserId = null
// 微信端厦门接口添加openId
Ajax.interceptors.request.use(conf => {
	if (conf.url.includes('/live/')) {
		const wxUserInfo = window.localStorage.getItem('wx_user_info') || '{}'
		const { openid: openId, nickname: userName, headimgurl: userPic } = JSON.parse(wxUserInfo)
		if (conf.method.toLocaleLowerCase() === 'post') {
			conf.data.openId = openId
			conf.data.clientType = 2
			conf.data.userName = userName
			conf.data.userPic = userPic
		} else {
			conf.params.openId = openId
			conf.params.clientType = 2
			conf.params.userName = userName
			conf.params.userPic = userPic
		}
	}
	return conf
})
// 端内接口添加userId并且添加clientType区分0:家长端1:园丁端和2:微信端
Ajax.interceptors.request.use(async conf => {
	if (namespace && !isExistUserId) {
		const userInfoStr = await jsToClient('getUserInfo', '')
		const userInfo = JSON.parse(userInfoStr)
		if (conf.method.toLocaleLowerCase() === 'post') {
			conf.data.userId = userInfo.uid
			conf.data.clientType = namespace === 'parent' ? 0 : 1
			isExistUserId = userInfo.uid
		} else {
			conf.params.userId = userInfo.uid
			conf.params.clientType = namespace === 'parent' ? 0 : 1
			isExistUserId = userInfo.uid
		}
	}
	return conf
})
const API = {
	get (url, params, config = {}) {
		return new Promise((resolve, reject) => {
			Ajax.get(url, {
				params,
				...config
			}).then(res => {
				if (res.data.code === 10000 || res.data.returncode * 1 === 10000) {
					resolve(res.data.body)
				} else {
					reject(res.data.message)
				}
			}).catch((err, errType) => {
				reject(err, errType)
			})
		})
	},
	post (url, params, conf = {}) {
		return new Promise((resolve, reject) => {
			Ajax.post(url, params, conf).then(res => {
				if (res.data.code === 10000 || res.data.returncode * 1 === 10000) {
					resolve(res.data.body)
				} else {
					reject(res.data.message)
				}
			}).catch((err, errType) => {
				reject(err, errType)
			})
		})
	},
	xm_post (url, params, conf = {}) {
		return new Promise((resolve, reject) => {
			Ajax.post(url, params, conf).then(res => {
				resolve(res.data)
			}).catch((err, errType) => {
				reject(err, errType)
			})
		})
	}
}

export { API }
