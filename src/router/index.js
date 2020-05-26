import Vue from 'vue'
import Router from 'vue-router'
import BfRoutes from './modules/bf-routes'
import XmRoutes from './modules/xm-routes'
Vue.use(Router)
export default new Router({
	mode: 'history',
	base: 'bflive',
	routes: [
		...BfRoutes,
		...XmRoutes
	]
})
