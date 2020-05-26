
import { Live } from '@/api/index'
export default {
	namespaced: true,
	state: {
		commentParams: {}
	},
	getters: {
		getCommentParams (state) {
			// console.log(state.commentParams)
			return state.commentParams
		}
	},
	mutations: {
		SET_COMMENTPARAM: (state, body) => {
			state.commentParams = body
		}
	},
	actions: {
		getCommonParams ({ commit }, params) {
			return new Promise((resolve, reject) => {
				Live.getCommentPageParam(params).then(({ returncode, message, body }) => {
					if (returncode === '10000') {
						commit('SET_COMMENTPARAM', body)
						resolve(body)
					}
				})
			})
		}
	}
}
