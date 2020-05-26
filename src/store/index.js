import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/im-user'
import conversation from './modules/im-conversation'
import group from './modules/im-group'
import blacklist from './modules/im-blacklist'
import User from './modules/user'
import Live from './modules/live'
const getters = {}
const mutations = {
	startComputeCurrent (state) {
		state.intervalID = setInterval(() => {
			state.current = Date.now()
		}, 500)
	},
	stopComputeCurrent (state) {
		clearInterval(state.intervalID)
		state.intervalID = 0
	},
	showMessage (state, options) {
		if (state.message) {
			state.message.close()
		}
		console.log('showMessage', options.message)
	}
}
const actions = {}
Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		current: Date.now(), // 当前时间
		intervalID: 0,
		message: undefined
	},
	getters,
	mutations,
	actions,
	modules: {
		conversation,
		group,
		user,
		blacklist,
		User,
		Live
	}
})
