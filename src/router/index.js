import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/home'
},
{
  path: '/main',
  name: 'main',
  component: () => import('../views/Main.vue'),
  children: [{
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/operation',
    name: 'operation',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/operation.vue')
  },
  {
    path: '/schedule',
    name: 'schedule',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/schedule.vue')
  },
  {
    path: '/page1',
    name: 'page1',
    component: () => import('../views/page1.vue')
  },
  {
    path: '/page2',
    name: 'page2',
    component: () => import('../views/page2.vue')
  },
  {
    path: '/page3',
    name: 'page3',
    component: () => import('../views/page3.vue')
  }
  ]
}

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
export default router
