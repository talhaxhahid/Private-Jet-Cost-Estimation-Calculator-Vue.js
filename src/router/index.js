import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultView from '@/views/ResultView.vue'
import AdminView from  '@/components/adminView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/result',
    name: 'result',
    props: route => ({
      jets: JSON.parse(route.query.jets || '{}'),
      formData: JSON.parse(route.query.formData || '{}')
    }),
    component: ResultView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
