import Vue from 'vue' // 引入vue
import Vuex from 'vuex' // 引入vuex
// 使用vuex
Vue.use(Vuex)
// 创建Vuex实例
const store = new Vuex.Store({
  state: {
    count: 1,
    role: ''
  },
  mutations: {

  },
  getters: {

  }
})

export default store // 导出store 文件末尾要换行
