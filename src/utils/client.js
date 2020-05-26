import dsbridge from 'dsbridge'
// 命名空间
const namespace = dsbridge.call('getNameSpace')
// js调客户端
/**
 * ------常用方法名-----
 * 获取用户信息: getUserInfo
 * 客户端跳转: jumpTo
 * 客户端报数: onStatisticEvent
 * 友盟报数: onUmengEvent
 * */
const jsToClient = (methodName, params) => {
	const para = typeof params === 'string' ? params : JSON.stringify(params)
	return new Promise((resolve, reject) => {
		let nativeMethod = namespace + '.' + methodName
		let hasNativeMethod = dsbridge.hasNativeMethod(nativeMethod)
		if (hasNativeMethod) {
			dsbridge.call(nativeMethod, para, res => {
				resolve(res)
			})
		} else {
			let error = '请使用掌通家园APP打开'
			reject(error)
		}
	})
}
// 客户端调js
const clientToJs = (methodName, callback) => {
	dsbridge.register(namespace + '.' + methodName, res => {
		callback && callback(res)
	})
}
/**
 * 埋点统计
 * @param {Number} type   1=页面埋点  2=事件埋点
 * @param {Object} obj   参数对象
 */
const onStatisticEvent = (type, obj) => {
	let eventId = 'sdo_bfn_pv'
	let umengId = ''
	let umengObj = {}

	if (type === 2) {
		eventId = 'sdo_bfn_event'
		umengId = obj.event_id
	} else {
		umengId = obj.page
	}
	dsbridge.call(namespace + '.onStatisticEvent', JSON.stringify({
		event: eventId,
		data: obj
	}), function () {})

	if (obj.parm !== undefined && obj.parm !== '') {
		umengObj = { eventid: umengId, para: obj.parm }
	} else {
		umengObj = { eventid: umengId }
	}

	dsbridge.call(namespace + '.onUmengEvent', JSON.stringify(umengObj), function () {})
}
export {
	namespace,
	jsToClient,
	clientToJs,
	onStatisticEvent
}
