// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import 'bootstrap'

// 導出 vee-validate 相關設定檔
import {
  ValidationObserver, // form 驗證元件
  ValidationProvider, // input 驗證元件
  extend, // 擴充功能
  localize, // 語系設定
  configure // 設定檔
} from 'vee-validate'
import TW from 'vee-validate/dist/locale/zh_TW.json'
// 導入所有 vee-validate 驗證規則
import * as rules from 'vee-validate/dist/rules'

import App from './App'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'
import datetimeFilter from './filters/datetime'

Vue.use(VueAxios, axios)
Vue.use(Datetime)

// 手動導出 vee-validate 所有規則，再加入 vee-validate 擴充
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule])
})
extend('name', {
  validate: value => {
    const pattern = /^[\u4e00-\u9fa5a-zA-Z]+$/
    const re = new RegExp(pattern)
    return re.test(value)
  },
  message: '姓名僅允許中文與英文'
})
extend('address', {
  validate: value => {
    const pattern = /^([\u4e00-\u9fa5]+\d*)+$/
    const re = new RegExp(pattern)
    return re.test(value)
  },
  message: '地址不符合規則'
})

// 設定語系
localize('zh_TW', TW)
// 針對單一元件與表單進行驗證
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

// 針對 bootstrap 進行驗證的 classname 設定
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
})

Vue.config.productionTip = false

Vue.component('Loading', Loading)
Vue.filter('currency', currencyFilter)
Vue.filter('datetime', datetimeFilter)

axios.defaults.withCredentials = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_PATH}/api/user/check`
    axios.post(api).then(response => {
      if (response.data.success) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})
