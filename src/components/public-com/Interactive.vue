<template>
	<div class="interactive-container">
		<div class="clearfix interactive-top">
			<div class="hot-title"><span>全部</span> <i class="hot-icon"></i></div>
			<div id="lookNum">观看人数{{commonparams.liveAudiences}}</div>
		</div>
		<van-pull-refresh style="padding:1rem 0 2.4rem 0" v-model="refreshing" @refresh="onRefresh">
			<van-list
					v-model="loading"
					:finished="finished"
                    :offset="300"
					finished-text="没有更多了"
					@load="onLoad"
			>
				<div class="commentList-box">
					<ul id="commentList">
						<li class="clearfix" :key="index" v-for="(value,index) in list">
							<div class="comment-left"><img  :src='value.userPic+"?imageView2/1/w/80/h/80"'/></div>
							<div class="comment-right">
								<div class="cr-box clearfix">
									<div class="cr-left">
										<div class="crl-top"><i v-if="value.isTeacher">教师</i><span>{{value.userName}}</span></div>
										<div class="crl-mid">{{value.content}}</div>
									</div>
									<div class="cr-right">
										<template v-if="value.likeState == 1">
										<i class="icon-heart active" ></i>
										<span class="active">{{value.likeCount}}</span>
										</template>
										<template v-else>
											<i class="icon-heart" ></i>
											<span>{{value.likeCount}}</span>
										</template>
									</div>
								</div>
								<div class="cr-bottom clearfix">
									<div class="crl-bottom">{{value.createTimeStr}}</div>
									<div v-if="curuserId ==value.userId"  class="crl-delete">删除</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</van-list>
		</van-pull-refresh>
        <div v-if="nodatashow" class="empty">
            <img :src="nodataimg" alt="">
            <p>还没人给老师留言，快来参加互动吧</p>
        </div>
	</div>
</template>
<script>
import { namespace } from '@/utils/client'
import { mapActions } from 'vuex'
import common from '@/utils/common'
import { Live } from '@/api/index'
export default {
	data () {
		return {
			list: [],
			nodataimg: require('@/assets/images/live/icon_sign_empty.png'),
			teacherimg: require('@/assets/images/live/teacher.png'),
			dadimg: require('@/assets/images/live/Dad.png'),
			momimg: require('@/assets/images/live/Mom.png'),
			refreshing: false,
			loading: false,
			error: false,
			finished: false,
			nodatashow: false,
			flag: false,
			commonparams: {},
			realuserType: '',
			pageNo: 1,
			pageSize: 8,
			userInfo: {},
			curuserId: ''
		}
	},
	created () {
	},
	mounted () {
	},
	computed: {
	},
	methods: {
		// 映射异步的actions
		...mapActions({
			getUserInfo: 'User/getUserInfo'
		}),
		// 处理默认头像
		dealImg (userInfo) {
			let userPic
			if (!userInfo.avatar) {
				if (namespace === 'parent') {
					// 家长端user_type 1管理员 2 亲友 3创建
					if (userInfo.userSex === 'male') {
						// 男
						userPic = this.dadimg
					} else {
						// 女
						userPic = this.momimg
					}
				} else {
					// 园丁端user_type 2园长3老师

					userPic = this.teacherimg
				}
			} else {
				userPic = userInfo.avatar
			}
			return userPic
		},
		dealUserType (userInfo) {
			if (namespace) {
				if (namespace === 'parent') {
					// 家长端user_type 1管理员 2 亲友 3创建
					if (userInfo.user_type) {
						this.realuserType = userInfo.user_type
					}
				} else {
					// 园丁端user_type 2园长3老师
					if (userInfo.user_type === '2') {
						this.realuserType = 5
					} else if (userInfo.user_type === '3') {
						this.realuserType = 4
					}
				}
			}
		},
		async onLoad () {
			this.nodatashow = false
			this.loading = true
			if (!this.flag) {
				this.userInfo = await this.getUserInfo()
				this.curuserId = this.userInfo ? this.userInfo.uid : ''
				this.dealUserType(this.userInfo)
				let body = await Live.getCommentPageParam({ liveId: common.getUrl('liveId'), appType: common.getUrl('appType') })
				this.commonparams = body
				this.flag = true
			}
			let params = {
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				liveId: this.commonparams.liveId,
				userId: this.userInfo ? this.userInfo.uid : '',
				userType: this.realuserType,
				viewType: 1,
				studentId: this.userInfo ? this.userInfo.student_uid : '',
				babyId: this.userInfo ? this.userInfo.uid : ''
			}

			try {
				let body = await Live.getCommentList(params)
				setTimeout(() => {
					if (body.list.length > 0) {
						// 数据绑定
						this.list = this.list.concat(body.list)
						this.pageNo++
					} else if (body.list.length === 0) {
						// 提示无数据
						this.nodatashow = true
						this.finished = true
					}
					if (body.totalPages < this.pageNo || body.list.length < 20) {
						this.finished = true
					}
					this.loading = false
				}, 500)
			} catch (e) {
				this.nodatashow = true
				this.refreshing = false
				this.finished = true
			}
		},
		onRefresh () {
			setTimeout(() => {
				// 清空列表数据
				this.finished = false
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				this.refreshing = false
				this.list = []
				this.pageNo = 1
				this.onLoad()
			}, 500)
		}
	}
}
</script>
<style lang="scss">
    .interactive-container .refresh-box{
        background: #fff;
    }
</style>
<style lang="scss">
	.interactive-container {
		.van-list__finished-text{
			display: none;
		}
		.van-input-fill-x{
			width: 76%;
			float: left;
			margin-right: 2%;
			button{
				float: right;
			}
		}
		.van-cell{
			padding: 8px 16px;
		}
		.van-input-fill-x textarea:placeholder-shown::placeholder {
			color: transparent;
		}
		.van-input-fill-x .van-field {
			position: relative;
			max-height: 116px;
			overflow-y: auto;
		}
		.van-input-label {
			position: absolute;
			left: 30px;
			top: 18px;
			pointer-events: none;
			font-size: 15px;
			color: #BBBBBD;
		}

		.van-input-label i{
			display: inline-block;
			width: 16px;
			height: 16px;
			color: #BBBBBD;
			background:url(../../assets/images/live/icon_edit.png) no-repeat left center;
			background-size:16px 16px;
			vertical-align: text-top;
		}
	}
</style>
<style lang="scss" scoped>
	.interactive-container {
		font-size: 40px;
	}
	.interactive-top{
		position: fixed;
		z-index: 99999;
		background: #fff;
		width: 100%;
	}
	.clearfix:after {
		content: '.';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden
	}

	.clearfix {
		display:block;
	}

	*html .clearfix {
		height: 1%
	}
	.hot-title{
		height:80px;
		line-height:80px;
		padding-left: 30px;
		color:#818D9D;
		font-size:28px;
		display: inline-block;
		float:left;
	}
	.hot-title i{
		width: 30px;
		height: 30px;
		display:inline-block;
		background:url(../../assets/images/live/icon_hot.png) no-repeat;
		background-size:100% 100%;
		vertical-align: text-top;
	}
	.commentList-box{
		padding-left:30px;

	}
	.commentList-box #commentList li{
		border-bottom:1px solid rgba(238,238,238,1);
	padding:20px 0;
	}
	.commentList-box #commentList li:nth-child(1){
		padding: 0 0 20px 0;
	}
	.commentList-box #commentList li.active{
		display:block;
		border-bottom:none;
	}
	.commentList-box #commentList li .comment-left, .commentList-box #commentList li  .comment-right{
		float:left;
	}
	.commentList-box #commentList li .comment-right{
		margin-left:24px;
		width:82.3%;
	}
	.commentList-box #commentList li .comment-left{
		width:80px;
		height:80px;
	}
	.commentList-box #commentList li .comment-left img{
		width:80px;
		height:80px;
		border-radius:50%;
		margin-top:8px;
	}
	.commentList-box #commentList li  .comment-right .cr-left {
		float:left;
	}
	.commentList-box #commentList li  .cr-right{
		float:right;
		/*margin-right:24px;*/
		margin-top:15px;
	}
	.commentList-box #commentList li  .cr-right .icon-heart{
		display:block;
		height: 32px;
		padding: 25px;
		background:url(../../assets/images/live/icon-heart-n@2x.png) no-repeat center;
		background-size:32px 32px;
	}
	.commentList-box #commentList li  .cr-right span{
		display:inline-block;
		text-align:center;
		width: 70px;
		font-size:22px;
		color:rgba(129,141,157,1);
	}
	.commentList-box #commentList li   .cr-right span.active{
		font-size:22px;
		color:#FF5E68;

	}
  .commentList-box #commentList li .cr-right .icon-heart.active{
  background:url(../../assets/images/live/icon-heart-p@2x.png) no-repeat center;
  background-size:32px 32px;
  }
  .commentList-box #commentList li .comment-right  .cr-left .crl-top i{
  width:70px;
  height:30px;
  line-height: 30px;
  text-align: center;
  font-style: normal;
  display:inline-block;
  background:linear-gradient(-28deg,rgba(85,172,248,1),rgba(123,198,249,1));
  border-radius:15px;
  font-size:22px;
  color:#fff;
  margin-right:10px;
  margin-top: 3px;
  vertical-align: text-top;
  }
	.commentList-box #commentList li .comment-right .cr-left .crl-top span{
		font-size:28px;
		font-weight:400;
		color:rgba(51,51,51,1);
	}
  .commentList-box #commentList li .comment-right .cr-left .crl-mid{
	width: 500px;
	font-size: 28px;
	font-weight: 400;
	letter-spacing: 0;
	word-break:break-all;
	word-wrap:break-word;
	color: rgba(129, 141, 157, 1);
	margin: 20px 0 8px 0;
  }

	.commentList-box #commentList li .comment-right .cr-left .crl-mid.active {
		width: 500px;
		font-size: 28px;
		font-weight: 400;
		letter-spacing: 0;
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-line-clamp: 6; /*要显示的行数*/
		-webkit-box-orient: vertical;
		color: rgba(129, 141, 157, 1);
		margin: 22px 0 24px 0;
	}
	.commentList-box #commentList li .show-all{
		font-size: 28px;
		color: #00aaff;
	}
	.commentList-box #commentList li  .crl-bottom{
		float:left;
	}
	.commentList-box #commentList li   .crl-delete{
		float:right;
		margin-right:12px;
	}
	.commentList-box #commentList li   .crl-bottom , .commentList-box #commentList li  .crl-delete{
		font-size:22px;
		font-weight:400;
		color:rgba(129,141,157,1);
	}

	.van-footer{
		background-color: #F2F3F5;
		height: auto;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 99;
		padding: 8px 14px;
		box-sizing: border-box;
	}
	.download-button{
		background: #00AAFF;
		font-size: 28px  /* 36/75 */;
		color: #FFFFFF;
		text-align: center;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 99;
	}
	.footer-box{
	margin:15px 20px;
	width:76%;
	height:auto;
	background:#fff;
	border-radius:10px;
	float:left;
	position: relative;
	padding-left: 30px;
	}
	.footer  .footer-box textarea{
		text-align: left;
	width:100%;
	background:#fff;
	height: 70px;
	color:#818D9D;
	font-size: 28px;
	overflow-y: auto;
	box-sizing: border-box;
	padding: 20px 30px 20px 0;
	float: left;
	margin:0;
	line-height:35px;
	border: none;
	text-indent: 2em;
	max-height: 162px;
	}
	.footer  .footer-box textarea::-webkit-input-placeholder{
		color: #BBBBBD;
		background:url(../../assets/images/live/icon_edit.png) no-repeat left center;
		background-size:32px 32px;
	}
	.van-footer  .van-btn{
		width:18%;
		height:35px;
		line-height:35px;
		background:rgba(204,204,204,1);
		border-radius:5px;
		text-align:center;
		color:#fff;
		font-size:13px;
		padding: 0;
		position: absolute;
		top: 50%;
		margin-top: -17.5px;
		border: none;
		right: 15px;
	}
	.van-footer  .van-btn.active{
		background: #00AAFF;
	}
	.no-txt{
		font-size:30px;
		color:#333;
		text-align:center;
	}
	#lookNum{
		height:80px;
		line-height:80px;
		display: inline-block;
		float: right;
		padding-right: 30px;
		color: #818D9D;
		font-size: 28px;
	}
    .empty{
        text-align: center;
        padding: 100px 0;
        background: #fff;
    }
    .empty img{
        width: 501px;
        height: 291px;
    }
    .empty p{
        margin-top: 20px;
        font-size: 32px;
        color: #333333;
    }
</style>
