import { jsToClient } from '@/utils/client'
export default {
	created () {
		const { pvPara, umengPara } = this.$options
		// pv报数
		pvPara && jsToClient('onStatisticEvent', {
			event: 'sdo_bfn_pv',
			data: pvPara
		})
		// 友盟报数
		umengPara && jsToClient('onUmengEvent', umengPara)
	}
}
