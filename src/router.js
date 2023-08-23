import { createRouter, createWebHistory } from 'vue-router';
import Home from "../src/pages/Home.vue";
import About from "../src/pages/About.vue";
import Apartment from "../src/pages/Apartment.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/apartment/:id',
      name: 'apartment',
      component: Apartment,
    },
  ],
});

export default router;
