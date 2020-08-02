import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import SvgIcon from 'vue-svgicon'
import '@/icons/components'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import VueClipboard from 'vue-clipboard2'
import { STORE } from "@/constant/storageConstant";

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.use(VueClipboard)

new Vue({
  created () {
    //在页面加载时读取sessionStorage里的状态信息
    const saveStore = sessionStorage.getItem(STORE)
    if (saveStore) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(saveStore)))
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem(STORE, JSON.stringify(this.$store.state))
    })
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
