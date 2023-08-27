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
    <AppHeader />
  </header>

  <h3 v-if="store.auth.authenticated">
    Hello {{ store.auth.user.username }} !!
  </h3>
  <h3 v-else>PLease login</h3>
  <RouterView />
  <AppFooter />
</template>

<style lang="scss" scoped></style>
