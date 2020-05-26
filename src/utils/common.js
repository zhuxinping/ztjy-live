import { formatFixedDate, getUrlParam, inViewPort, scrollTo, versionCompare } from 'szyutils'
export default {
	// 时间格式化函数
	formatFixedDate (date, format) {
		return formatFixedDate(date, format)
	},
	// 获取地址栏参数
	getUrl (name) {
		return getUrlParam(name)
	},
	isInViewPort (ele) {
		return inViewPort(ele)
	},
	scrollToPosition (to, duration) {
		return scrollTo(to, duration)
	},
	versionCompare (v1, v2) {
		return versionCompare(v1, v2)
	},
	prefix () {
		const currentHost = window.location.host
		let prefix = process.env.NODE_ENV === 'production' ? '' : 'alpha'
		if (currentHost.indexOf('-') > -1) {
			prefix = currentHost.split('-')[0]
		}
		return prefix
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
	vCompare (v1, v2) {
		return versionCompare(v1, v2)
	}
}
