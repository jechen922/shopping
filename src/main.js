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

import App from './App'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'
import datetimeFilter from './filters/datetime'

Vue.use(VueAxios, axios)
Vue.use(Datetime)
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
