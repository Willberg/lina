import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import SvgIcon from 'vue-svgicon'
import '@/icons/components'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.use(VueClipboard)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
