<template>
	<div class="intro-container">
        <template v-if="showUpdate">
            <div class="update">
                <img :src="updateimg" alt="">
                <p> 您目前使用的App版本低，请升级后体验</p>
            </div>
        </template>
        <template v-else>
            <div class="intro" v-html="liveIntroduction"></div>
            <div v-if="nodatashow" class="empty">
                <img :src="nodataimg" alt="">
                <p>该内容暂无简介</p>
            </div>
        </template>
	</div>
</template>
<script>
import { Live } from '@/api/index'
import { namespace } from '@/utils/client'
import common from '@/utils/common'
import { mapActions } from 'vuex'
export default {
	data () {
		return {
			liveIntroduction: '',
			nodataimg: require('@/assets/images/live/icon_qs1@3x.png'),
			updateimg: require('@/assets/images/live/update_img.png'),
			nodatashow: false,
			showUpdate: false,
			userInfo: {},
			namespace: ''
		}
	},
	created () {
		this.namespace = namespace
		this.getIntroduce()
	},
	mounted () {
		document.title = '简介'
	},
	methods: {// 升级按钮引导
		// 映射异步的actions
		...mapActions({
			getUserInfo: 'User/getUserInfo'
		}),
		async initData () {
			try {
				this.nodatashow = false
				const body = await Live.liveIntroduction({ liveId: common.getUrl('liveId') })
				if (body.liveIntroduction) {
					this.liveIntroduction = body.liveIntroduction
				} else {
					this.nodatashow = true
				}
			} catch (e) {
				this.nodatashow = true
				console.log(e)
			}
		},
		async	getIntroduce () {
			if (this.namespace) {
				// 6.24或6.23版本 进一步判断是6.23版本 并且是竖屏的 展示升级按钮
				// 调用ds获取版本号
				this.userInfo = await this.getUserInfo()
				if (common.vCompare(this.userInfo.st.app_ver, '6.24.0') * 1 < 0 && common.getUrl('screenType') * 1 === 2) {
					this.showUpdate = true
					return
				}
				this.initData()
			} else {
				// 6.23以下版本的并且是竖屏的，在简介里面展示升级按钮引导
				if (common.getUrl('screenType') * 1 === 2) {
					this.showUpdate = true
					return
				}
				this.initData()
			}
		}
	}
}
</script>
<style lang="scss" scoped>
    .intro{
        padding: 40px;
    }
	.intro-container {
		font-size: 40px;
		/deep/ img{
			max-width: 100%!important;
		}
	}
	.empty{
		text-align: center;
		padding: 100px 0;
		background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
	}
	.empty p{
		margin-top: 20px;
		font-size: 32px;
		color: #333333;
	}
    .update{
        width: 100%;
        text-align: center;
        padding: 100px 0;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .update img{
        width: 350px;
        height: 271px;
    }
    .update p{
        margin-top: 20px;
        font-size: 32px;
        color: #333333;
    }
</style>
