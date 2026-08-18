import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import PosHomeView from '@/views/PosHomeView.vue'
import PosCheckoutView from '@/views/PosCheckoutView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'pos-home',
    component: PosHomeView
  },
  {
    path: '/checkout',
    name: 'pos-checkout',
    component: PosCheckoutView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
