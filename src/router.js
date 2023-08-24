import { createRouter, createWebHistory } from 'vue-router';
import Home from "../src/pages/Home.vue";
import About from "../src/pages/About.vue";
import Apartment from "../src/pages/Apartment.vue";
import SignIn from "@/pages/SignIn.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Registration from "@/pages/Registration.vue";

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
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/register',
      name: 'register',
      component: Registration
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }
  ],
});

export default router;