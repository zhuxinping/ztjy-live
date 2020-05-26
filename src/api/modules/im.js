import { API } from '../api'
import { xmpath } from '../apiHost'
// 接口地址
export const IM_API_URL = {
	getUserSign: xmpath('/im/getUserSign/v1.0?reqcode=111'),
	sendBusinessMsg: xmpath('/im/groupchat/sendMsg/v1.0?reqcode=111')
}
// api请求方法定义
export default {
	async getUserSign (params, conf) {
		return await API.post(IM_API_URL.getUserSign, params, conf)
	},
	async sendBusinessMsg (params, conf) {
		return await API.post(IM_API_URL.sendBusinessMsg, params, conf)
	}
}
