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

  <RouterView />
  <AppFooter />
</template>

<style lang="scss" scoped>
template {
  position: relative;
}
</style>
