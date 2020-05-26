<template>
	<!-- 引导页 -->
	<section class="guide-container">
		<div class="guide-content">
			<div class="open-app" @click="onLaunchApp">打开App</div>
			<!-- <div v-if="isVivo" class="szyDownload-btn open-app">打开App</div> -->
			<p>未安装掌通家园，点击下方按钮下载</p>
			<div class="szyDownload-btn download-app">下载App</div>
        </div>
		<div class="app-model" v-show="isShowModel">
			<div class="model-content"></div>
		</div>
		<div class="download_qrcode_img" style="display: none;"></div>
	</section>
</template>
<script>
import Common from '@/utils/common'
const Base64 = require('js-base64').Base64
export default {
	created () {
		document.title = '掌通家园'
		const ua = navigator.userAgent.toLowerCase()
		if ((/micromessenger/).test(ua)) {
			this.isWx = true
			this.isShowModel = true
		} else {
			this.isWx = false
			this.isShowModel = false
		}
		// let usString = JSON.stringify(navigator.userAgent).toLowerCase()
		// if (usString.indexOf('vivo') > -1) {
		// 	this.isVivo = true
		// }
		// alert(JSON.stringify(navigator.userAgent))
	},
	mounted () {
		// let param = this.$route.query.base64
		// if (param) {
		// 	this.base64Param = param
		// }
		this.$nextTick(() => {
			window.szyDownload.init({
				downLoadInfo: {
					type: 'download_qrcode_img',
					parentNode: '.share-container',
					appType: 'parent'
				},
				clickListener: true
			})
		})
		console.log(this.base64Param)
		// alert('参数：' + JSON.stringify(this.base64Param))
		this.base64Param = Base64.encodeURI(JSON.stringify(this.base64Param))
		// this.target = Common.getUrl('share_f') === 'parent' ? 0 : 1
		this.target = 0
		console.log(Base64.decode(this.base64Param), 'ppppppp')
		this.launchApp()
	},
	data () {
		return {
			// isVivo: false,
			isWx: false,
			isShowModel: false,
			base64Param: {
				type: 'watchLive',
				data: {
					exterType: 2,
					liveId: Common.getUrl('liveId'),
					schoolId: Common.getUrl('schoolId'),
					type: 2
				},
				source: 4
			},
			target: 0,
			launchFail: false,
			isLaunching: false,
			urlConfig: [
				{
					IOS_PROFILE: 'XMSZYZTJY://',
					AND_PROFILE: 'ztjy://com.seebaby/',
					IOS_DOWNLOAD: 'https://itunes.apple.com/us/app/zhang-tong-jia-yuan-shi-pin-ban/id914847333?l=zh&ls=1&mt=8',
					AND_DOWNLOAD: 'http://static.szy.cn/app/parent-release-6.7.3-zhangtong_download.apk'
				},
				{
					IOS_PROFILE: 'com.szy.ztjyyd://',
					AND_PROFILE: 'ztjy.teacher.applink://com.yuanding.seebaby/',
					IOS_DOWNLOAD: 'http://itunes.apple.com/us/app/id966806518',
					AND_DOWNLOAD: 'https://ztjyupdate.ztjy61.com/3036099ffd428c5b3d43c6b4580d34ad-ZTJY'
				}
			]
		}
	},
	methods: {
		launchApp () {
			let { isAndroid } = this.detectVersion()
			let profileURL = isAndroid ? this.urlConfig[this.target].AND_PROFILE : this.urlConfig[this.target].IOS_PROFILE
			let resultURL = profileURL + this.base64Param
			console.log(resultURL)
			// alert('url + 参数base64：' + JSON.stringify(resultURL))
			if (isAndroid) {
				let ifr = document.createElement('iframe')
				// if (this.isVivo) {
				// 	resultURL = profileURL
				// }
				ifr.setAttribute('src', resultURL)
				ifr.setAttribute('style', 'display:none')
				document.body.appendChild(ifr)
			} else {
				console.log(resultURL)
				window.location.href = resultURL
			}
		},
		onDownload () {
			let { isAndroid } = this.detectVersion()
			let downloadURL = isAndroid ? this.urlConfig[this.target].AND_DOWNLOAD : this.urlConfig[this.target].IOS_DOWNLOAD
			window.location.href = downloadURL
		},
		onLaunchApp () {
			// if (this.isWx) {
			// 	this.isShowModel = true
			// } else {
			// }
			if (!this.isLaunching) {
				this.isLaunching = true
				this.launchApp()
				setTimeout(() => {
					this.launchFail = true
					setTimeout(() => {
						this.launchFail = false
						this.isLaunching = false
					}, 2000)
				}, 1000)
			}
		},
		detectVersion () {
			let isAndroid, isIOS, isIOS9, version
			let u = navigator.userAgent
			let ua = u.toLowerCase()

			if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // android终端或者uc浏览器
				// Android系统
				isAndroid = true
			}

			if (ua.indexOf('like mac os x') > 0) {
				// ios
				let regStrSaf = /os [\d._]*/gi
				let verinfo = ua.match(regStrSaf)
				version = (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
			}
			let versionStr = version + ''
			if (versionStr !== 'undefined' && versionStr.length > 0) {
				version = parseInt(version)
				if (version >= 8) {
					// ios9以上
					isIOS9 = true
				} else {
					isIOS = true
				}
			}
			return { isAndroid, isIOS, isIOS9 }
		},
		// 判断手机上是否安装了app，如果安装直接打开url，如果没安装，执行callback
		openApp (url, callback) {
			let { isAndroid, isIOS, isIOS9 } = this.detectVersion()
			if (isAndroid || isIOS) {
				let hasApp = true
				let t = 1000
				let openScript = setTimeout(function () {
					if (!hasApp) {
						callback && callback()
					}
					document.body.removeChild(ifr)
				}, 2000)

				var t1 = Date.now()
				var ifr = document.createElement('iframe')
				ifr.setAttribute('src', url)
				ifr.setAttribute('style', 'display:none')
				document.body.appendChild(ifr)

				let timeout = setTimeout(function () {
					var t2 = Date.now()
					if (t2 - t1 < t + 100) {
						hasApp = false
					}
				}, t)
				console.log(openScript, timeout)
			}
			if (isIOS9) {
				location.href = url
				setTimeout(function () {
					callback && callback()
				}, 2000)
			}
		},
		closeModel () {
			this.isShowModel = false
		}
	}
}
</script>
<style lang="scss" scoped>
	.guide-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		background:url(../../assets/images/guide/bg_app@2x.png) no-repeat;
        background-size: 100% 672px;
		.guide-content {
			display: flex;
			flex-flow: column;
			// justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			padding-top: 464px;
			text-align: center;
			.open-app {
				width: 500px;
				height: 88px;
				line-height: 88px;
				background: #FFFFFF;
				border-radius: 44px;
				font-size: 32px;
				color: #00AAFF;
			}
			p {
				font-size: 28px;
				color: #333333;
				padding-top: 240px;
			}
			.download-app {
				margin-top: 30px;
				width: 500px;
				height: 88px;
				line-height: 88px;
				background: #00AAFF;
				border-radius: 44px;
				font-size: 32px;
				color: #fff;
			}
		}
		.app-model {
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0px;
			right: 0px;
			top: 0px;
			bottom: 0px;
			background: rgba(0,0,0,0.4);
		}
		.model-content {
			margin: 89px auto;
			width: 600px;
			height: 500px;
			background:url(../../assets/images/guide/browser_open@2x.png) no-repeat;
            background-size: 600px 500px;
		}
	}
</style>
