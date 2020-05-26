<!--suppress ALL -->
<template>
    <div class="live-container">
        <van-tabs v-model="active" sticky swipeable title-active-color="#00AAFF">
            <van-tab :key="index" v-for="(item,index) in tabList" :title="item.title">
                <div class="refresh-box">
                    <van-pull-refresh v-model="list[index].refreshing" @refresh="onRefresh(index)">
                        <van-list
                                v-model="list[index].loading"
                                :finished="list[index].finished"
                                :finished-text="list[index].nomore"
                                @load="onLoad(index)"
                        >
                            <!--<lazy-component>-->
                            <div class="live-list">
                                <div class="live-content"  :key="key" v-for="(item,key) in list[index].items">
                                    <Debounce :time='500' :isDebounce="1">
                                    <div class="live" :data-liveid="item.liveId" ref="list" @click="goLiveDetail(item)">
                                        <div v-lazy-container="{ selector: 'img' }">
                                            <img v-if="item.liveState == 1" class="zbz" :data-src="onlineicon" alt="">
                                            <img class="lazyload" height="imgH" :data-loading='loadimg'
                                                 :data-error='errorimg'
                                                 :data-src='item.liveBackground+"?imageView2/1/w/750/h/422"'>
                                            <div class="live-top">
                                                <p class="headline">{{item.liveTitle}}</p>
                                                <p v-if="item.liveAudiences && item.liveState  != 0" class="viewnum">
                                                    <img :data-src="eyeicon" alt="" class="icon_see"> {{item.liveAudiences}}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    </Debounce>
                                </div>
                            </div>
                            <!--</lazy-component>-->
                        </van-list>
                        <div v-if="list[index].nodatashow" class="empty">
                            <img :src="nodataimg" alt="">
                            <p>哎呀，没有可观看的内容</p>
                        </div>
                        <div @click="onLoad(index)" v-if="list[index].errorshow" class="empty active">
                            <img :src="errordataimg" alt="">
                            <p>唔， 网络好像有问题...<br>点击页面重新加载</p>
                        </div>
                    </van-pull-refresh>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Live } from '@/api/index'
import { jsToClient, namespace, onStatisticEvent } from '@/utils/client'
import common from '@/utils/common'
export default {
	components: {},
	data () {
		return {
			liveData: [{
				liveStatus: {}
			}, {
				liveStatus: {}
			}],
			tabList: [{
				title: '课堂频道'
			}, {
				title: '即将开始'
			}],
			active: 0,
			onlineicon: require('@/assets/images/live/icon_zbz@3x.png'),
			eyeicon: require('@/assets/images/live/icon_see@3x.png'),
			errorimg: require('@/assets/images/live/video_cover.png'),
			loadimg: require('@/assets/images/live/grey.gif'),
			nodataimg: require('@/assets/images/live/icon_qs1@3x.png'),
			errordataimg: require('@/assets/images/live/icon_disconnect@2x.png'),
			list: [
				{
					items: [],
					refreshing: false,
					loading: false,
					finished: false,
					flag: false,
					nomore: '',
					errorshow: false,
					nodatashow: false
				},
				{
					items: [],
					refreshing: false,
					loading: false,
					finished: false,
					flag: false,
					nomore: '',
					errorshow: false,
					nodatashow: false
				}
			],
			userInfo: {},
			imgH: '',
			params: []
		}
	},
	created () {
	},
	mounted () {
		// 初始化背景图高度
		this.initHeight()
		document.title = '公开课'
		// window.addEventListener('scroll',common.deBounce(250,false,this.geted))
	},
	computed: {
	},
	methods: {
		geted () {
			console.log(1)
		},
		// 映射异步的actions
		...mapActions({
			getUserInfo: 'User/getUserInfo'
		}),
		initHeight () {
			// 根据宽高比初始化背景图高度
			let imageRatio = 750 / 422
			let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
			let height = ((w - 30) / imageRatio)
			this.imgH = height
		},
		async onLoad (index) {
			this.list[index].loading = true
			this.list[index].errorshow = false
			if (!this.list[index].flag) {
				this.userInfo = await this.getUserInfo()
				this.list[index].flag = true
			}
			try {
				let { returncode, body, message } = await Live.getUserLiveList({
					isExpectLive: index,
					sessionId: this.userInfo && this.userInfo.ssid,
					source: (namespace === 'parent' ? 'source=parent' : 'source=teacher'),
					liveStatus: JSON.stringify(this.liveData[index].liveStatus)
				})
				setTimeout(() => {
					const { liveList } = body
					if (returncode * 1 === 10000) {
						this.liveData[index].liveStatus = body.liveStatus
						if (liveList.length === 0) {
							this.list[index].finished = true
							this.list[index].nomore = ''
							this.list[index].nodatashow = true // 提示无数据
							this.list[index].errorshow = false // 提示无数据
							return
						}
						this.list[index].items = this.list[index].items.concat(liveList)
						this.$nextTick(() => {
							for (let i = 0; i < this.$refs.list.length; i++) {
								let curEle = this.$refs.list[i]
								if (!curEle.getAttribute('data-exposure')) {
									if (common.isInViewPort(curEle)) {
										curEle.setAttribute('data-exposure', true)
										this.params.push({
											'live_id': curEle.getAttribute('data-liveid')
										})
									}
								}
							}
							if (namespace) {
								this.params.length && onStatisticEvent(1, { page_category: '3', page: 'openclass_list', parm: JSON.stringify(this.params), f_page_location: index ? 'live_begin' : 'live_list' })
							} else {
								this.params.length && window.szyreport.reportPV({
									data: {
										'status': '', // 状态--%>
										'trial': '', // 试看(选填)--%>
										'stay_time': '', // 时长(选填)--%>
										'progress': '', // 浏览进度(选填)--%>
										'page_category': '3', // 页面大类(选填)--%>
										'page': 'openclass_list', // 页面(选填)--%>
										'page_id': '', // 页面ID(选填)--%>
										'parm': JSON.stringify(this.params), // 自定义参数(选填)--%>
										'f_page': '', // 来路页面(选填)--%>
										'f_page_id': '', // 来路页面ID(选填)--%>
										'f_page_location': index ? 'live_begin' : 'live_list'// 来路页面位置(选填)--%>
									}, // 页面报数参数（必填）--%>
									prefix: common.prefix()// 测试环境'alpha'，线上环境''（选填）--%>
								})
							}
						})
						if (liveList.length > 0 && liveList.length < 10) {
							this.list[index].finished = true
							this.list[index].nomore = '没有更多数据了'
						}
					} else {
						this.list[index].finished = true
						this.list[index].nomore = ''
						this.list[index].nodatashow = true // 提示无数据
						this.list[index].errorshow = false // 提示无数据
						this.$toast(message)
					}
					this.list[index].loading = false
					this.list[index].refreshing = false
				}, 500)
			} catch (e) {
				this.list[index].errorshow = true
				this.list[index].finished = true
				this.list[index].nomore = ''
				this.list[index].refreshing = false
				this.list[index].loading = false
				this.$toast('网络可能不给力，请稍后再试哦~')
			}
		},
		onRefresh (index) {
			setTimeout(() => {
				// 清空列表数据
				this.list[index].finished = false
				// 重新加载数据
				this.list[index].items = []
				this.list[index].errorshow = false
				this.list[index].refreshing = false
				this.list[index].nodatashow = false
				this.liveData[index].liveStatus = {}
				// 将 loading 设置为 true，表示处于加载状态
				this.onLoad(index)
			}, 500)
		},
		// 跳转直播详情
		goLiveDetail (item) {
			if (namespace) {
				// screenType=1横屏 screenType=2竖屏
				jsToClient('jumpTo', {
					action: 'commonJump',
					data: {
						'type': 'watchLive',
						'data': {
							exterType: 1,
							liveId: item.liveId,
							type: item.screenType
						},
						'source': 4 // 跳转来源，5-短信唤起
					}
				})
			} else {
				if (item.screenType === 1) {
					window.location = 'appcommunicationapi={"type":2,"extend":{"pagename":"livedetail","liveid":' + item.liveId + '},"goto":0}'
					// this.$router.push('appcommunicationapi={"type":2,"extend":{"pagename":"livedetail","liveid":' + item.liveId + '},"goto":0}')
				} else {
					this.$toast('当前App 版本不支持此直播类型，请更新 App 后查看')
				}
			}
		}
	}
}
</script>
<style lang="scss">
    .live-container .refresh-box {
        background: #f2f3f5;
    }
    .live-container .van-pull-refresh {
        background: #f2f3f5;
    }

</style>
<style lang="scss">
    .live-container {
        background: #f2f3f5;
        .van-tabs__line {
            position: absolute;
            bottom: 5px;
            left: 0;
            z-index: 1;
            height: 3px;
            background-color: #00AAFF;
            border-radius: 3px;
            width: 68px !important;
        }
        .van-tab {
            position: relative;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            flex: 1;
            box-sizing: border-box;
            min-width: 0;
            padding: 0 5px;
            color: #646566;
            font-size: 16px;
            line-height: 44px;
            text-align: center;
            cursor: pointer;
        }
        .van-tabs__nav--line {
            box-sizing: content-box;
            height: 100%;
            padding-bottom: 0;
            border-bottom: 0.01rem solid #DADADA;
        }
    }
</style>
<style lang="scss" scoped>
    .live-container {
        height: 100%;
        background-color: #f2f3f5;
        .live-content{
            margin: 30px 30px 50px;
            box-sizing: border-box;
        }
        font-size: 40px;
        .refresh-box {
            height: 100%;
            box-sizing: border-box;
        }
        .live-list {
            box-sizing: border-box;
        }
        .live {
            width: 100%;
            background-color: #fff;
            border-radius: 8px;
            position: relative;
            margin-bottom: 30px;
            .zbz {
                width: 90px;
                position: absolute;
                right: 20px;
                top: 20px;
            }
            .lazyload {
                width: 100%;
                display: block;
                border-top-left-radius: 8px;
                -webkit-border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                -webkit-border-top-right-radius: 8px;
                min-height: 422px;
            }
            .live-top {
                width: 100%;
                padding: 17px 20px 17px 20px;
                line-height: initial;
                box-sizing: border-box;
                .headline {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 32px;
                    color: #333333;
                    line-height: normal;
                }
                .viewnum {
                    font-size: 26px;
                    color: #BBBBBD;
                    line-height: 37px;
                    padding-bottom: 3px;
                    .icon_see {
                        width: 28px;
                    }
                }
            }
        }
        .empty {
            text-align: center;
            padding: 1.33333rem 0;
            background: #fff;
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
        }
        .empty img {
            width: 501px;
            height: 291px;
        }
        .empty p {
            margin-top: 20px;
            font-size: 32px;
            color: #333333;
        }
        .empty.active img {
            width: 334px;
            height: 196px;
        }
    }
</style>
