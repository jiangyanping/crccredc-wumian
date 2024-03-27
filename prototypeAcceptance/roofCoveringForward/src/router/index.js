import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import OtherRes from '../views/OtherRes.vue'
import WeixinBind from '../views/WeixinBind.vue'

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)

}

const routes = [
  {
    path: '/',
    redirect: './home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/otherRes',
    name: 'OtherRes',
    component: OtherRes
  },
  {
    path: '/weixinBind',
    name: 'WeixinBind',
    component: WeixinBind
  }
]

const router = new VueRouter({
    /*mode: 'history',*/
    base: process.env.BASE_URL,
    routes
})

export default router
