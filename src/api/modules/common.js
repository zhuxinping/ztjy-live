import { API } from '../api'
import { xmh5path } from '../apiHost'
// 接口地址
export const COMMON_API_URL = {
	getDocument: xmh5path('/school/getDocumentNew')
}
// api请求方法定义
export default {
	async getDocument (params, conf) {
		return await API.get(COMMON_API_URL.getDocument, params, conf)
	}
}
