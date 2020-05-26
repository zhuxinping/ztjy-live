/**
 * 北分负责的页面路由配置文件
 */
import { WxConf } from '@/utils/wx-conf'
import md5 from 'js-md5'
const _import = require('../import_' + process.env.NODE_ENV)
const VerticalPage = _import('vertical-page/Index')
const HorizontalPage = _import('horizontal-page/Index')
const NotWechatPage = _import('not-wechat/Index')
const AppGuide = _import('app-guide/Index')
const NotFound = _import('not-found/Index')

// 判断是否为微信内打开
const beforeEnter = async (to, from, next) => {
	const ua = navigator.userAgent.toLowerCase()
	if ((/micromessenger/).test(ua)) {
		const { liveId, t = '', sign = '' } = to.query
		const md5Str = md5(`liveId=${liveId}&t=${t}&key=${liveId}`)
		if (md5Str.toUpperCase() === sign.toUpperCase()) {
			await WxConf.init()
			next()
		} else {
			next({ path: '/not-found', replace: true })
		}
	} else {
		next({ path: '/not-wechat', replace: true })
	}
}
export default [
	{
		path: '/play-vertical',
		name: 'VerticalPage',
		component: VerticalPage,
		beforeEnter
	}, {
		path: '/play-horizontal',
		name: 'HorizontalPage',
		component: HorizontalPage,
		beforeEnter
	}, {
		path: '/not-wechat',
		name: 'NotWechatPage',
		component: NotWechatPage
	}, {
		path: '/app-guide',
		name: 'AppGuide',
		component: AppGuide
	}, {
		path: '/not-found',
		name: 'NotFound',
		component: NotFound
	}
]
