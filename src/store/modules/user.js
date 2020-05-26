import { jsToClient } from '@/utils/client'
export default {
	namespaced: true,
	state: {
		localCount: {

		},
		userInfo: {
			'uid': '',
			'baby_uid': '',
			'ssid': '',
			'token': '', // 旧的社区token,php接口重构时,已经固定传空字符串.
			'userToken': '', // 用户token
			'student_uid': '',
			'class_uid': '',
			'school_id': '',
			'user_type': '', // 园丁端：2-园长，3-老师, 家长端：1-管理员 2-亲友，3-创建者
			'nickname': '', // 家长姓名
			'avatar': '', // 家长头像
			'schoolName': ''// 老师幼儿园
		}
	},
	getters: {
		derivativeCount (state) {
			return state
		},
		userInfo (state) {
			return state.userInfo
		}
	},
	mutations: {
		SET_COUNT (state, payload) {
			state = payload
		},
		SET_USERINFO: (state, userInfo) => {
			state.userInfo = userInfo
		}
	},
	actions: {
		login ({ commit }, payload) {
			commit('SET_COUNT', payload)
		},
		getUserInfo ({ commit }) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
				    let userInfo = {
						'avatar': 'http://gw.szytest.com/Fo1_uX70-ddOf8DzKOpSQ0DP3Av-',
						'industryType': '',
						'isTrillMode': true,
						'jobName': '园长',
						'moduleType': '0',
						'nickname': '李宏晖Joe的得',
						'phoneNumber': '13003918650',
						'schoolName': '0测试2018---0',
						'schoolRecruitStatus': 0,
						'schoolType': '2',
						'schoolVipLevel': 0,
						'userSex': 'female',
						'userToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZUeXBlIjoiQW5kcm9pZCIsImlzT3BlcmF0aW9uIjpmYWxzZSwiYXBwVHlwZSI6IkFQUF9UWVBFX1RFQUNIRVIiLCJpc3MiOiJzenkiLCJpZCI6IjRFMTg3QzJFODFBODRBQ0NCMDU0QkZBQjhFODAyREY3IiwidXNlclR5cGUiOiJ0ZWFjaGVyIiwic2Vzc2lvbklkIjoiQUM1MTFBRDM4RkRENEVEM0ExNkNBMUExNkZENzM0QjQiLCJleHAiOjE1ODQ0MzAyNzEsInRva2VuVHlwZSI6MSwidXNlcklkIjoiYmM5NGE1MThhZjU2NWMzYjdhNDUiLCJpYXQiOjE1ODQ0MjMwNzF9.LKD4tlahm93Pd24dnnNytNIZ3FprdaQ7HdMSnIJXPXE',
						'account_type': 2,
						'baby_uid': '',
						'school_id': 'aBVUrlvBS9xvI028EtU',
						'ssid': '601E45C0A3E842F996C900FD1ACC4936',
						'st': {
							'adid': 'd318917d9c6cfbd3',
							'app_ver': '6.24.1',
							'channel': 'shenzhouying',
							'density': '2.0',
							'device_id': 'a927c40d1da936bfd4ddbfa0ec81ef35',
							'imei': 'A000007EAF0D94',
							'location': ',',
							'mac': '20:F7:7C:A1:1D:E1',
							'network': 'WiFi',
							'os_ver': '8.1.0',
							'phone_model': 'vivo Y83A',
							'platform': '3',
							'reqcodeversion': '5.3',
							'screen': '720x1520',
							'sp': '46000',
							'vendor': 'vivo',
							'zipcode': ''
						},
						'student_uid': '',
						'token': '',
						'type': 3,
						'uid': 'bc94a518af565c3b7a45',
						'user_type': '2'
					}
					commit('SET_USERINFO', userInfo)
					resolve(userInfo)
				}, 400)
				// jsToClient('getUserInfo', '').then((res) => {
				// 	let userInfo = JSON.parse(res)
				// 	commit('SET_USERINFO', userInfo)
				// 	resolve(userInfo)
				// })
			})
		}
	}
}
