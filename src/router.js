import { createRouter, createWebHistory } from "vue-router";
import Home from "../src/pages/Home.vue";
import Apartment from "../src/pages/Apartment.vue";
import Message from "@/pages/Message.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/apartment/:id",
      name: "apartment",
      component: Apartment,
    },
    {
      path: "/apartment/:id/message",
      name: "message",
      component: Message,
      props: true,
    },
  ],
});

export default router;
