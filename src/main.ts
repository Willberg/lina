import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import '@/icons/components'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
