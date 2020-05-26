const formatFixedDate = require('szyutils/modules/formatFixedDate')
// webpack配置
module.exports = {
	publicPath: '/bflive',
	assetsDir: 'static', // 打包后静态资源路径
	productionSourceMap: false,
	chainWebpack: config => {
		config.module
			.rule('images')
			.use('url-loader')
			.loader('url-loader')
			.tap(options => Object.assign(options, { limit: 10000 }))
	},
	configureWebpack: {
		output: {
			filename: 'static/js/[name].' + formatFixedDate((+new Date()), 'yyyyMMddHHmmss') + '.js',
			chunkFilename: 'static/js/[name].' + formatFixedDate((+new Date()), 'yyyyMMddHHmmss') + '.js'
		}
	},
	css: {
		extract: {
			filename: 'static/css/[name].' + formatFixedDate((+new Date()), 'yyyyMMddHHmmss') + '.css',
			chunkFilename: 'static/css/[id].' + formatFixedDate((+new Date()), 'yyyyMMddHHmmss') + '.css'
		}
	},
	devServer: {
		host: '0.0.0.0', // 服务启动时的主机名
		port: 8586, // 端口号
		// proxy: { // 代理设置
		// 	'/api': {
		// 		target: '<url>',
		// 		ws: true,
		// 		changeOrigin: true
		// 	}
		// },
		open: true // 自动打开浏览器
	}
}
