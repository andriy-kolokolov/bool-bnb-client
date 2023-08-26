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
        <RouterLink v-if="store.auth.authenticated" to="/dashboard"
          >Dashboard</RouterLink
        >
        <RouterLink v-if="!store.auth.authenticated" to="/signin"
          >Sign In</RouterLink
        >
        <RouterLink v-if="!store.auth.authenticated" to="/register"
          >Register</RouterLink
        >
        <button v-if="store.auth.authenticated" @click="store.auth.signOut()">
          Sign Out
        </button>
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
