import { createRouter, createWebHistory } from 'vue-router';
import Home from "../src/components/Home.vue";
import About from "../src/components/About.vue";
import Show from "../src/components/Show.vue";

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
      path: '/show/:id',
      name: 'show',
      component: Show,
    },
  ],
});

export default router;
