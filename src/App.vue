<script>
import { RouterLink, RouterView } from "vue-router";
import { store } from "@/store/store.js";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  components: {
    RouterLink,
    RouterView,
    AppHeader,
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
      <AppHeader />
      <div>
        <RouterLink v-if="!store.auth.authenticated" to="/signin"
          >Sign In</RouterLink
        >
        <RouterLink v-if="!store.auth.authenticated" to="/register"
          >Register</RouterLink
        >
        <button v-if="store.auth.authenticated" @click="store.auth.signOut()">
          Sign Out
        </button>
      </div>
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
