const user = {
	state: {
		currentUserProfile: {},
		isLogin: false,
		isSDKReady: false, // TIM SDK 是否 ready
		userID: '',
		userSig: '',
		sdkAppID: ''
	},
	mutations: {
		updateCurrentUserProfile (state, userProfile) {
			state.currentUserProfile = userProfile
		},
		toggleIsLogin (state, isLogin) {
			state.isLogin = typeof isLogin === 'undefined' ? !state.isLogin : isLogin
		},
		toggleIsSDKReady (state, isSDKReady) {
			state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
		},
		reset (state) {
			Object.assign(state, {
				currentUserProfile: {},
				isLogin: false,
				isSDKReady: false // TIM SDK 是否 ready
			})
		},
		GET_USER_INFO (state, payload) {
			state.userID = payload.userID
			state.userSig = payload.userSig
			state.sdkAppID = payload.sdkAppID
		}
	}
}

export default user
