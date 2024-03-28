import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './request/axios.js'
import VueAxios from 'vue-axios'
import scroller from 'v-scroller'
import 'v-scroller/dist/v-scroller.css'
import {remResize} from "./assets/js/rem";
import Message from './components/message/message.js'
import vuetify from './plugins/vuetify'

Vue.use(scroller)
Vue.config.productionTip = false
Vue.prototype.$message = Message;

Vue.use(VueAxios, axios);
remResize()
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
