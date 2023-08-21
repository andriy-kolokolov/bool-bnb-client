import { createRouter, createWebHistory } from 'vue-router'
import AppHome from "@/components/AppHome.vue";
import AppAbout from "@/components/AppAbout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppHome
    },
    {
      path: '/about',
      name: 'about',
      component: AppAbout
    }
  ]
})

export default router
