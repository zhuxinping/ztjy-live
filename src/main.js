import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TIM from 'tim-js-sdk'
import pv from './mixins/pv'
import 'zx-editor/dist/css/zx-editor.min.css'
import { Tab, Tabs, PullRefresh, Toast, List, Lazyload, Field, Button, Cell, Loading, Dialog } from 'vant'
// 防抖节流
import Debounce from './utils/debounce'

Vue.component('Debounce', Debounce)
Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。
Vue.prototype.TIM = TIM
Vue.prototype.$store = store
Vue.prototype.$szyreport = window.szyreport
Vue.prototype.$toast = Toast

Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
Vue.use(Toast)
Vue.use(List)
Vue.use(Field)
Vue.use(Button)
Vue.use(Cell)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Lazyload, {
	lazyComponent: true
})
Vue.config.productionTip = false
Vue.mixin(pv)

new Vue({
	render: h => h(App),
	router,
	store
}).$mount('#app')
