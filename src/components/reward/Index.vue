<template>
	<div v-show="rewardShow && resFlag" class="reward-model" @click.self="modelToggle">
		<div class="reward-wrapper">
            <div class="reward-title">
                喜欢老师
                <div class="reward-close" @click.self="modelToggle"></div>
            </div>
            <ul>
                <li class="flex-row">
                    <div class="gift-box" v-for="(item, index) of dataList" :key="index">
						<div :class="item.giftClass" @click="getRewardOrder(index,item)">
							<img class="reward-img" :src="item.image.imageUrl" alt="">
							<p v-show="!item.selected" class="gift-name">{{item.name}}</p>
							<p v-show="item.selected" class="gift-name">{{item.priceTxt}}￥</p>
							<p class="price">{{item.priceTxt}}￥</p>
							<div class="selected-bottom">赠送</div>
						</div>
                    </div>
					<!-- <div class="gift-box" @click="getRewardOrder">
                        <div class="gift-border">
							<img class="reward-img" src="http://snsimg.ztjystore.cn/ztnew/ad/img/2020/03/16/1584339674897908.png" alt="">
							<p class="gift-name">仙女棒</p>
							<p class="price">18.88￥</p>
							<div class="selected-bottom">赠送</div>
						</div>
                    </div> -->
                </li>
            </ul>
            <!-- <div class="flex-row price-desc">
                <div class="desc-icon"></div>
                <p>1元=1掌通币</p>
            </div> -->
        </div>
		<div class="reward-loading" v-show="loadingFlag">
			<van-loading size="40px" color="#fff" />
			<div style="color: #fff; font-size: 16px;padding-top: 10px;">支付中...</div>
		</div>
	</div>
</template>
<script>
import { LiveApi as Api } from '@/api'
// import { WxTools } from '@/utils/wx-conf'
// import Common from '@/utils/common'
import { setTimeout } from 'timers'
export default {
	name: 'reward',
	props: {
		rewardType: {
			type: Number,
			default: 2
		},
		rewardShow: {
			type: Number,
			default: 0
		},
		urlParams: {
			type: Object
		}
	},
	data () {
		return {
			resFlag: false,
			loadingFlag: false,
			giftClass: 'gift-border',
			isShowReward: this.rewardShow,
			dataList: [],
			imInfo: {},
			orderInfo: '',
			statusInfo: '',
			statusQueryNum: 0,
			objId: '',
			osType: 1,
			eventWords: 'gift'
		}
	},
	computed: {
	},
	created () {
		console.log('reward=reward=reward=reward=reward=reward=reward=reward=')
		this.eventWords = (this.rewardType * 1) === 1 ? 'gift' : 'redpacket'
		let u = navigator.userAgent
		let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //
		if (isIOS) {
			this.osType = 2
		} else {
			this.osType = 1
		}
	},
	mounted () {
		this.$nextTick(() => {
			this.getRewardList()
		})
	},
	methods: {
		// 关闭礼物弹窗
		modelToggle () {
			this.isShowReward = 0
			console.log(1000000)
			this.$emit('setRewardVisible', this.isShowReward, true)
		},
		// 获取礼物列表
		async getRewardList () {
			// let params = {
			// 	shopId: Common.getUrl('liveId') || '1',
			// 	anchorId: Common.getUrl('anchorId') || '1',
			// 	anchorType: Common.getUrl('anchorType') || 1,
			// 	giftType: this.rewardType
			// }
			let params = {
				shopId: this.urlParams.liveId || '1',
				anchorId: this.urlParams.anchorId || '1',
				anchorType: this.urlParams.anchorType || 1,
				giftType: this.rewardType
			}
			try {
				this.dataList = (await Api.getRewardList(params)).data
				this.dataList.forEach((ele, index) => {
					ele.selected = 0
					ele.click = 0
					ele.giftClass = 'gift-border'
				})
				this.resFlag = true
				console.log(this.dataList)
			} catch (error) {
				console.log(error)
			}
		},
		// 选中礼物，创建订单
		async getRewardOrder (index, item) {
			console.log('getRewardOrder')
			// 礼物选中状态
			this.dataList.forEach((ele, single) => {
				ele.selected = 0
				if (single === index) {
					console.log('======')
					console.log((this.dataList[index].click)++)
					this.$set(this.dataList[index], 'click', (this.dataList[index].click)++)
				} else {
					ele.click = 0
				}
				ele.giftClass = 'gift-border'
			})
			console.log(this.dataList, '-----')
			this.$set(this.dataList[index], 'giftClass', 'gift-border selected')
			// 选中礼物信息
			this.imInfo = this.dataList[index]
			this.dataList[index].selected = 1
			this.$forceUpdate()
			// 选中礼物报数
			// this.objId = Common.getUrl('liveId') + ';' + this.imInfo.giftId
			this.objId = this.urlParams.liveId + ';' + this.imInfo.giftId
			let params = {
				event_id: 'click_openclass_' + this.eventWords + '_choose',
				obj_id: this.objId
			}
			if (this.eventWords === 'gift') {
				params.parm = {
					gift: (index + 1)
				}
			} else {
				params.parm = {
					redpacket: (index + 1)
				}
			}
			params.parm = JSON.stringify(params.parm)
			this.szyEv(params)
			// this.eventWords
			let wxUserInfo = ''
			if (window.localStorage.getItem('wx_user_info')) {
				wxUserInfo = JSON.parse(window.localStorage.getItem('wx_user_info'))
			}
			if (this.dataList[index].click > 1) {
				this.loadingFlag = true
				let params = {
					giftId: item.giftId,
					giftNum: 1,
					rewardUser: wxUserInfo.openid || 'wx58264a82c91f879b',
					nickName: wxUserInfo.nickname,
					userPic: {
						imageUrl: wxUserInfo.headimgurl,
						weight: '',
						height: ''
					},
					platform: 0,
					osType: this.osType,
					// shopId: Common.getUrl('liveId') || 1,
					// shopName: Common.getUrl('shopName'),
					// anchorId: Common.getUrl('anchorId') || '1',
					// anchorType: Common.getUrl('anchorType') || 1
					shopId: this.urlParams.liveId || 1,
					shopName: this.urlParams.shopName,
					anchorId: this.urlParams.anchorId || '1',
					anchorType: this.urlParams.anchorType || 1
				}
				try {
					this.orderInfo = await Api.getRewardOrder(params)
					let payParam = {
						appId: this.orderInfo.h5PayParams.appId,
						timestamp: this.orderInfo.h5PayParams.timestamp,
						nonceStr: this.orderInfo.h5PayParams.nonceStr,
						package: this.orderInfo.h5PayParams.pk,
						signType: this.orderInfo.h5PayParams.signType,
						paySign: this.orderInfo.h5PayParams.sign,
						success: this.paySuccess,
						canel: this.payCanel,
						fail: this.payFail
					}
					// 调微信支付
					this.onBridgeReady(payParam)
					// WxTools.$emit('callWxPay', payParam)
				} catch (error) {
					console.log(error)
					this.loadingFlag = false
					this.$toast(error)
					this.modelToggle()
					// let paramIM = {
					// 	msgInfo: {
					// 		type: 5,
					// 		body: {
					// 			streamId: Common.getUrl('streamId'),
					// 			giftId: this.imInfo.giftId,
					// 			giftType: this.imInfo.giftType,
					// 			imageUrl: this.imInfo.image.imageUrl,
					// 			priceType: this.imInfo.priceType,
					// 			price: this.imInfo.price,
					// 			priceTxt: this.imInfo.priceTxt,
					// 			cnt: 1,
					// 			textContent: this.imInfo.name
					// 		}
					// 	}
					// }
					// console.log(this.paramIM)
					// 支付成功更新IM送礼物
					// this.$emit('paySuc', paramIM)
				}
			}
		},
		// 查询订单状态
		async QuertRewardOrderStatus () {
			this.statusQueryNum++
			let params = {
				orderId: this.orderInfo.orderId || 1,
				tradeNo: this.orderInfo.tradeNo || 1
			}
			try {
				this.statusInfo = await Api.QuertRewardOrderStatus(params)
				console.log(this.statusInfo)
				if (this.statusInfo.tradeStatus * 1 === 1) {
					this.loadingFlag = false
					// 关闭打赏弹窗
					this.modelToggle()
					this.$toast('支付成功')
					let paramIM = {
						msgInfo: {
							type: 5,
							body: {
								// streamId: Common.getUrl('streamId'),
								streamId: this.urlParams.streamId,
								giftId: this.imInfo.giftId,
								giftType: this.imInfo.giftType,
								imageUrl: this.imInfo.image.imageUrl,
								priceType: this.imInfo.priceType,
								price: this.imInfo.price,
								priceTxt: this.imInfo.priceTxt,
								cnt: 1,
								textContent: this.imInfo.name
							}
						}
					}
					console.log(this.paramIM)
					// 支付成功更新IM送礼物
					this.$emit('paySuc', paramIM)
				} else {
					// 每隔一秒查询订单状态，最多三次
					if (this.statusQueryNum < 4) {
						setTimeout(() => {
							this.QuertRewardOrderStatus()
						}, 1000)
					} else {
						this.$toast('订单支付失败，请联系掌通家园客服处理')
					}
				}
				// alert('支付订单id' + this.statusInfo.orderId + ' 支付订单id' + this.statusInfo.tradeNo + ' 订单状态' + this.statusInfo.tradeStatus)
			} catch (error) {
				console.log(error)
				this.loadingFlag = false
				this.$toast(error || '订单状态失败')
				console.log('订单状态失败=====')
			}
		},
		paySuccess () {
			// alert('微信支付成功1123333')
			// 选中礼物报数
			this.szyEv({
				event_id: 'openclass_' + this.eventWords + '_pay_suc',
				obj_id: this.objId
			})
			setTimeout(() => {
				this.QuertRewardOrderStatus()
			}, 1000)
		},
		payCanel () {
			this.loadingFlag = false
			// 微信支付取消
			this.szyEv({
				event_id: 'openclass_' + this.eventWords + '_pay_cancel',
				obj_id: this.objId
			})
			// console.log('微信支付取消567888')
		},
		payFail () {
			this.loadingFlag = false
			// 微信支付失败
			this.szyEv({
				event_id: 'openclass_' + this.eventWords + '_pay_fail',
				obj_id: this.objId
			})
			console.log('微信支付失败567888')
			// this.QuertRewardOrderStatus()
		},
		szyEv (data) {
			this.$szyreport.reportEvent({
				data: data,
				prefix: ''
			})
		},
		onBridgeReady (param) {
			window.WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					'appId': param.appId,
					'timeStamp': param.timestamp,
					'nonceStr': param.nonceStr,
					'package': param.package,
					'signType': param.signType,
					'paySign': param.paySign
				}, (res) => {
					// alert(JSON.stringify(res.err_msg) + '=======')
					if (res.err_msg === 'get_brand_wcpay_request:ok') {
						// alert(res.err_msg)
						this.paySuccess()
					} else if (JSON.stringify(res.err_msg).indexOf('cancel') > -1) {
						this.payCanel()
					} else {
						this.payFail()
					}
				}
			)
		}
	}
}
</script>
<style lang="scss" scoped>
.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.ellipsis {
    -webkit-line-clamp: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
	text-overflow: ellipsis;
	/*! autoprefixer: off */
	-webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
	/* autoprefixer: on */
}
.reward-model {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0,0.4);
	z-index: 1000;
    .reward-wrapper {
        position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		min-height: 282px;
		// max-height: 640px;
        background: #fff;
		ul {
			li {
				flex-wrap: wrap;
				padding: 0px 15px;
			}
		}
		.reward-img {
			width: 130px;
			height: 130px;
		}
		.reward-title {
			position: relative;
			padding-top: 30px;
			text-align: center;
			font-size: 32px;
			padding-bottom: 22px;
		}
		.reward-close {
			position: absolute;
			right: 29px;
			top: 30px;
			width: 30px;
			height: 30px;
			background: url(../../assets/images/reward/close@2x.png) center center no-repeat;
			background-size: 30px 30px;
			// background: url(../../assets/images/reward/close@2x.pngg)
		}
    }
	.gift-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		p.price {
			text-align: center;
			padding: 18px 0px 21px 0px;
			color: #BBBBBD;
			font-size: 26px;
		}
		p.gift-name {
			width: 130px;
			text-align: center;
			color: #818D9D;
			font-size: 28px;
			// padding: 18px 0px 21px 0px;
		}
		.gift-border {
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-top: 10px;
			width: 210px;
			border-radius:30px;
			margin: 0 15px 0 15px;
			overflow: hidden;
		}
		.selected-bottom {
			visibility: hidden;
			position: absolute;
			left: 0px;
			bottom: 0px;
			width:210px;
			height:60px;
			line-height: 60px;
			color: #fff;
			font-size: 26px;
			text-align: center;
			background:rgba(255,94,104,1);
		}
		.gift-border.selected {
			background: #F2F3F5;
			.selected-bottom {
				visibility: visible;
			}
		}
	}
	.price-desc {
		background: #F2F3F5;
		margin-top: 20px;
		.desc-icon {
			width: 30px;
			height: 30px;
			margin: 17px 16px 17px 36px;
			background: url(../../assets/images/reward/icon_tips@2x.png) center center no-repeat;
			background-size: 30px 30px;
		}
	}
	.reward-loading {
		position: fixed;
		left: 0px;
		right: 0px;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,0.4);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
</style>
