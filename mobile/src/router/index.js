import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Resource from '../views/Resource.vue'
import Control from '../views/Control.vue'
import Comment from '../views/Comment.vue'
import Engine from '../views/Engine.vue'
import OtherRes from '../views/OtherRes.vue'

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
    path: '/resource/:view/:mark',
    name: 'Resource',
    component: Resource
  },
  {
    path: '/control/:controlSort',
    name: 'Control',
    component: Control
  },
  {
    path: '/comment/:controlSort/:controlPointSort',
    name: 'Comment',
    component: Comment
  },
  {
    path: '/engine/:view/:controlSort',
    name: 'Engine',
    component: Engine
  },
  {
    path: '/otherRes/:view/:mark/:resFid',
    name: 'OtherRes',
    component: OtherRes
  },
]

const router = new VueRouter({
    /*mode: 'history',*/
    base: process.env.BASE_URL,
    routes
})

export default router
