const currentHost = window.location.host
let prefix = process.env.NODE_ENV === 'production' ? '' : 'alpha'
let BASE_API = ''
let WX_AUTH = ''
let XM_API = ''
let XM_H5_API = ''
if (currentHost.indexOf('-') > -1) {
	prefix = currentHost.split('-')[0]
}
if (prefix === 'dev' || prefix === 'wx') {
	prefix = 'alpha'
}
switch (prefix) {
case 'dev':
	BASE_API = 'http://dev-api.szy.cn'
	WX_AUTH = 'http://dev-api.szy.cn'
	XM_H5_API = 'https://wx.szy.cn/H5Server'
	break
case 'alpha':
	BASE_API = 'https://alpha-api.szy.cn'
	// WX_AUTH = 'http://dev-api.szy.cn'
	WX_AUTH = 'https://wx-debug.szy.cn'
	XM_API = 'https://a.szy.com'
	XM_H5_API = 'https://wx.szy.cn/H5Server'
	break
case 'rc':
	BASE_API = 'https://rc-api.szy.cn'
	WX_AUTH = 'https://rc-web.szy.cn'
	XM_API = 'https://zthsback.szy.cn'
	XM_H5_API = 'https://ztjywx.szy.cn/H5Server'
	break
default:
	BASE_API = 'https://api.szy.cn'
	WX_AUTH = 'https://web.szy.cn'
	XM_API = 'https://zths.szy.cn'
	XM_H5_API = 'https://ztjywx.szy.cn/H5Server'
	break
}
const path = _path => BASE_API + _path
const wxPath = _path => WX_AUTH + _path
const xmpath = _path => XM_API + _path
const xmh5path = path => XM_H5_API + path

export {
	path,
	wxPath,
	xmpath,
	xmh5path
}
