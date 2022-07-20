import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import api from './config/api'


Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.jlyBaseUrl = api.jlyBaseUrl
axios.defaults.baseURL = '/api'

Vue.use(ElementUI);
new Vue({
  axios,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
