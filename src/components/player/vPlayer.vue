<template>
	<div class="share-player-container" :class="{vertical: vertical}">
		<div v-if="+options.liveStatus === 0 && !vertical" v-show="!isError" class="not-start-container">
			<div v-if="!vertical" class="not-start-wrapper">
				<h1 class="live-room-name">{{options.liveTitle}}</h1>
				<div class="text-mid">距离开始还有</div>
				<div class="live-clock">{{clockText}}</div>
			</div>
			<img class="bg" :src="options.poster" alt="">
		</div>
		<div v-show="isError" class="player-error-msg" :class="{horizontal: !vertical}">
			<div>
				<img class="icon" src="@/assets/images/player/logo@2x.png" alt="">
				<p>{{errorMsg}}</p>
			</div>
		</div>
		<div @click.self="togglePlay" v-show="showPlayBtn" class="vertical-player"  :class="{vertical: vertical, hidden: +options.liveStatus !== 1}"></div>
		<div id="share-player-wrapper" class="share-player-wrapper"></div>
	</div>
</template>
<script>
import defaultPosterHor from '@/assets/images/player/live_default.png'
import defaultPosterVer from '@/assets/images/player/poster-ver.png'
export default {
	name: 'vPlayer',
	props: {
		errorCode: {
			type: Number,
			default: 0
		},
		vertical: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object
		}
	},
	data () {
		return {
			player: null,
			showPlayBtn: true,
			isError: this.errorCode > 0,
			nowTime: Date.now()
		}
	},
	watch: {
		errorCode (n) {
			if (n > 0) {
				this.isError = true
			} else {
				this.isError = false
			}
		}
	},
	computed: {
		errorMsg () {
			let errorMsg = ''
			switch (this.errorCode) {
			case 1:
				errorMsg = '直播已结束'
				break
			case 2:
				errorMsg = '准备中，请晚点再来'
				break
			case 3:
				errorMsg = '网络似乎中断了，请检查网络设置'
				break
			}
			return errorMsg
		},
		clockText () {
			const { liveBeginTime } = this.options
			const nowTime = this.nowTime
			const startTime = new Date(liveBeginTime)
			const diff = parseInt((startTime - nowTime) / 1000)
			const day = parseInt(diff / (24 * 3600))
			const hourse = parseInt((diff % (24 * 3600)) / 3600)
			const minute = parseInt(((diff % (24 * 3600)) % 3600) / 60)
			const seconds = parseInt(((diff % (24 * 3600)) % 3600) % 60)
			let text = ''
			if (day > 0) {
				text = `${day}天 `
			}
			return `${text}${hourse >= 10 ? hourse : '0' + hourse}:${minute >= 10 ? minute : '0' + minute}:${seconds >= 10 ? seconds : '0' + seconds}`
		}
	},
	methods: {
		initPlayer () {
			this.$nextTick(() => {
				let { src: m3u8, autoplay = false, volume = 1, liveStatus = 0 } = this.options
				let poster = this.options.poster || (this.vertical ? defaultPosterVer : defaultPosterHor)
				this.player = new window.TcPlayer('share-player-wrapper', {
					m3u8: m3u8.replace('http:', 'https:'),
					poster: {
						style: 'cover',
						src: poster
					},
					controls: this.vertical ? 'none' : 'system',
					autoplay,
					live: liveStatus * 1 === 1,
					volume,
					pausePosterEnabled: false,
					x5_orientation: 1,
					x5_player: false,
					systemFullscreen: true,
					x5_fullscreen: 'true',
					// x5_type: 'h5-page',
					listener: msg => {
						if (msg.type.toLowerCase() === 'error') {
							if (m3u8 !== 'no live') {
								this.isError = true
								this.$emit('onError', msg)
							}
						}
						if (msg.type.toLowerCase() === 'playing') {
							this.showPlayBtn = false
							this.$emit('onPlay')
						}
						if (msg.type.toLowerCase() === 'pause') {
							this.showPlayBtn = true
							this.$emit('onPause')
						}
					}
				})
				// 处理微信默认全屏播放的问题
				this.player.video.el.setAttribute('x5-playsinline', true)
				this.vertical && this.player.video.el.setAttribute('x5-video-player-type', 'h5')
				// 直播未开始时，加载倒计时
				liveStatus !== 1 && this.changeClock()
				this.handleVisibilityChange()
			})
		},
		togglePlay () {
			this.player.togglePlay()
		},
		changeClock () {
			const timer = setTimeout(() => {
				this.nowTime = Date.now()
				clearTimeout(timer)
				if (this.nowTime < new Date(this.options.liveBeginTime) || this.options.liveStatus !== 1) {
					this.changeClock()
				} else {
					this.$emit('countDownOver')
				}
			}, 1000)
		},
		// 监听页面切换到后台
		handleVisibilityChange () {
			let hidden, visibilityChange
			if (typeof document.hidden !== 'undefined') {
				hidden = 'hidden'
				visibilityChange = 'visibilitychange'
			} else if (typeof document.msHidden !== 'undefined') {
				hidden = 'msHidden'
				visibilityChange = 'msvisibilitychange'
			} else if (typeof document.webkitHidden !== 'undefined') {
				hidden = 'webkitHidden'
				visibilityChange = 'webkitvisibilitychange'
			}
			document.addEventListener(visibilityChange, () => {
				if (!document[hidden]) {
					this.player.play()
				} else {
					this.player.pause()
				}
			}, false)
		}
	},
	mounted () {
		this.$nextTick(() => {
			this.initPlayer()
		})
	}
}
</script>
<style lang="scss">
	.share-player-container {
		width: 100%;
		height: 422px;
		position: relative;
		&.vertical {
			height: 100%;
			// video {object-fit:fill !important;}
		}
		.vertical-player {
			position: absolute;
			width: 120px;
			height: 120px;
			left: 50%;
			top: 50%;
			transform: translate3d(-50%, -50%, 0);
			background: url(../../assets/images/player/icon_bf@3x.png) 0 0 no-repeat;
			background-size: 100% 100%;
			z-index: 80;
			&.vertical {
				position: fixed;
				z-index: 2000;
				&.hidden {
					display: none;
				}
			}
		}
		.share-player-wrapper {
			width: inherit;
			height: inherit;
		}
		.player-error-msg {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 34px;
			color: #ffffff;
			background-color: #20B5FF;
			background-size: 100% 100%;
			background-position: 0 0;
			background-repeat: no-repeat;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 100;
			.horizontal {
				background-image: url(../../assets/images/player/bg-video@2x.png);
			}
			.icon {
				width: 120px;
				height: 120px;
				margin: 0 auto 20px;
				display: block;
			}
		}
		.not-start-container {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 200;
			background: #000;
			.bg {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			.not-start-wrapper {
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				background: rgba(0, 0, 0, .6);
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
				z-index: 200;
				color: #fff;
				font-size: 28px;
			}
			.live-room-name {
				font-size: 38px;
			}
			.text-mid {
				margin: 30px 0;
			}
			.live-clock {
				color: #FDE22F;
			}
		}
		.vcp-error-tips {
			display: none !important;
		}
		.vcp-controls-panel {
			font-size: 32px;
			height: 90px;
			display: flex;
			align-items: center;
			display: none !important;
		}
		.vcp-panel-bg {
			background-color: transparent !important;
		}
		.vcp-timelabel {
			height: 66px;
			flex: 5;
			padding: 0;
			font-size: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.vcp-playing .vcp-playtoggle {
			background-image: url(../../assets/images/player/icon-pause.png);
			background-position: center center;
		}
		.vcp-playtoggle {
			width: 66px;
			height: 66px;
			background-color: rgba(0, 0, 0, .4);
			background-image: url(../../assets/images/player/icon-play.png);
			border-radius: 50%;
			margin: 0 20px;
			background-size: 50px 50px;
			background-position: 12px center;
			background-repeat: no-repeat;
		}
		.vcp-timeline {
			position: static;
			flex: 5;
			left:0;
			top: 0;
			height: 20px;
			display: flex;
			align-items: center;
		}
		.vcp-timeline .vcp-slider {
			margin-top: 0;
		}
		.vcp-fullscreen-toggle {
			background: rgba(0,0,0, .4) url(../../assets/images/player/icon-fullscreen.png) center center no-repeat;
			background-size: 34px 34px;
			height: 66px;
			width: 66px;
			margin: 20px;
			border-radius: 50%;
		}
		.vcp-fullscreen .vcp-fullscreen-toggle {
			background: url(../../assets/images/player/exit-full-screen.png) center center no-repeat;
			background-size: 34px 34px;
		}
		.vcp-poster-pic.cover {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>
