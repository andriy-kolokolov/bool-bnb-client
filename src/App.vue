<script>
import { RouterLink, RouterView } from "vue-router";
import { store } from "@/store/store.js";
import AppFooter from "./components/AppFooter.vue";

export default {
  components: {
    RouterLink,
    RouterView,
    AppFooter,
  },
  data() {
    return {
      store,
    };
  },
};
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>

        <a href="http://127.0.0.1:8000/admin">Dashboard</a>
        <a href="http://127.0.0.1:8000/login">Login</a>

      </nav>
    </div>
  </header>

  <h3 v-if="store.auth.authenticated">
    Hello {{ store.auth.user.username }} !!
  </h3>
  <h3 v-else>PLease login</h3>
  <RouterView />
  <AppFooter />
</template>

<style lang="scss" scoped></style>
