// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 样式组件需要单独引入
import qs from 'qs'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$qs = qs
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})

// 导航守卫 控制用户不登陆的话无法使用其它页面
// router.beforeEach((to, from, next) => {
//   let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

//   if (userInfo && userInfo.access_token) {
//     next()
//   } else {
//     next('/login')
//   }
// })
