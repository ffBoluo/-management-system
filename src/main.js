import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入按需的样式标签
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element'

// 导入全局样式
import './assets/css/base.css'

// 导入axios网路模块
// import { request } from './network/net'
import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//  设置拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
