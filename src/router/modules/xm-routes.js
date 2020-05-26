/**
 * 厦门负责的页面路由配置文件
 */
const _import = require('../import_' + process.env.NODE_ENV)
const About = _import('about/Index')
const IM = _import('im/Index')
const RichText = _import('live/richText/Index')
const LiveList = _import('live/liveList/Index')
const Introduce = _import('live/Introduce/Introduce')
const Interactive = _import('live/Interactive/Interactive')
const vodList = _import('live/components/vodList')
const Agreement = _import('common/Agreement')
export default [
	{
		path: '/about',
		name: 'AboutPage',
		component: About
	},
	{ // 联调结束后需要删除
		path: '/demo',
		name: 'IMDEMO',
		component: IM
	},
	{
		path: '/richText',
		name: 'RichTextPage',
		component: RichText
	},
	{
		path: '/liveList',
		name: 'LiveListPage',
		component: LiveList
	},
	{
		path: '/introduce',
		name: 'IntroducePage',
		component: Introduce
	},
	{
		path: '/vodlist',
		name: 'VodPage',
		component: vodList
	},
	{
		path: '/interactive',
		name: 'InteractivePage',
		component: Interactive
	},
	{
		path: '/agreement',
		name: 'AgreementPage',
		component: Agreement
	}
]
