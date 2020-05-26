<template>
    <div id="editorContainer" class="zx-container">
    </div>
</template>
<script>
import ZxEditor from 'zx-editor'
import { jsToClient, clientToJs, namespace } from '@/utils/client'

export default {
	data () {
		return {
			editor: ''
		}
	},
	mounted () {
		// 调用初始化富文本编辑器
		this.initZxEditor()
		// 调用客户端方法，将传递过来的数据设置到编辑器上
		this.initZxEditorContent()
		document.title = '编辑图文简介'
	},
	methods: {
		// 初始化富文本编辑器
		initZxEditor () {
			let that = this
			this.editor = new ZxEditor('#editorContainer', {
				editable: true,
				placeholder: '请输入...',
				cursorColor: '#333',
				fixed: false,
				// 禁用图片自动处理
				customPictureHandler: true,
				toolbarBtns: ['select-pic', 'text-style']
			})
			// 为工具栏添加自定义按钮
			this.editor.toolbar.addButton({
				name: 'select-pic',
				className: 'toolbar-icon-pic',
				events: {
					type: 'click',
					handler: function () {
						console.log('handler')
						// 在这里调用原生上传图片
						jsToClient('selectMedia', {
							'type': 2,
							'isShowCamera': true,
							'maxMediaNumber': 50,
							'isCut': false, // 频是否需要裁剪，默认添加裁剪 上传视频安卓也为true 图片不知道
							'selectedPicLocalUrl': []
						}).then((pdata) => {
							pdata = typeof (pdata) === 'string' ? JSON.parse(pdata) : pdata
							for (let i = 0; i < pdata.photo.length; i++) {
								// 上传七牛云
								that.uploadVideo(pdata.photo[i])
							}
						})
					}
				}
			})
		},
		// 上传七牛云方法
		uploadVideo (pdata) {
			let that = this
			jsToClient('uploadMedia', {
				'photo': [{
					'photoFilePath': pdata.photoFilePath,
					'width': pdata.width, // 视频开始时间  单位毫秒
					'height': pdata.height// 视频结束时间 单位毫秒
				}],
				'interruptMode': 1,
				'cellNetMode': 1,
				'compressMode': 1,
				'slicesMode': 8,
				'compressId': '',
				'businessId': '10008'
			})
			// 上传成功
			clientToJs('uploadSuccess', (d) => {
				d = typeof (d) === 'string' ? JSON.parse(d) : d
				for (let i = 0; i < d.fileUrls.length; i++) {
					let u = d.fileUrls[i].url// 将这个链接插入富文本
					let img = new Image()
					img.src = u
					that.editor.insertElm(img)
				}
			})
			// 上传失败
			clientToJs('uploadFail', (val) => {
				jsToClient('jumpTo', {
					action: 'toast',
					data: {
						message: '上传失败'
					}
				})
			})
		},
		// 创建完成按钮
		finishBtn () {
			// 创建完成按钮
			jsToClient('jumpTo', {
				action: 'topbar',
				data: {
					right_txt: '完成',
					clickAction: 'js',
					js: namespace + '.openShare'
				}
			})
			// 注册客户端方法
			clientToJs('openShare', () => {
				let content
				content = this.editor.getHtml()
				jsToClient('jumpTo', {
					action: 'openClassPhotoTextEdit',
					data: {
						content: content
					}
				})
			})
		},
		// 创建返回按钮
		goBackBtn (data) {
			// 创建返回按钮
			jsToClient('jumpTo', {
				action: 'topBack',
				data: {
					leftText: '返回',
					clickAction: namespace + '.goBack',
					js: namespace + '.goBack'
				}
			})
			// 注册返回按钮事件
			clientToJs('goBack', () => {
				let actionTitles = ['放弃编辑', '继续编辑']
				if (data + '' !== this.editor.getHtml()) {
					jsToClient('jumpTo', {
						action: 'ShowAlert',
						data: {
							title: '',
							message: '放弃图文编辑吗？',
							actionTitles: actionTitles
						}
					}).then((res) => {
						if (res === actionTitles[0]) {
							jsToClient('jumpTo', {
								action: 'finish',
								data: {
									needRefrush: false,
									param: data
								}
							})
						}
					})
				} else {
					jsToClient('jumpTo', {
						action: 'finish',
						data: {
							needRefrush: false,
							param: data
						}
					})
				}
			})
		},
		// 注册返回按钮事件

		// 初始化编辑器内容
		initZxEditorContent () {
			jsToClient('dataToH5', {}).then((data) => {
				this.editor.setHtml(data)
				// 创建返回按钮
				this.goBackBtn(data)
				// 创建完成按钮
				this.finishBtn()
			})
		}
	}
}
</script>
<style lang="scss">
    .zx-container {
        padding: 15px;
        box-sizing: border-box;
        font-size: 20px;
    }
</style>
