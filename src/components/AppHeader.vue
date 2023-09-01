<script>
import { store } from "@/store/store.js";
import AppMenu from "./AppMenu.vue";
import AppSearch from "./AppSearch.vue";
import About from "../pages/About.vue";

export default {
  components: {
    AppMenu,
    AppSearch,
    About,
  },
  data() {
    return {
      store,
    };
  },
};
</script>

<template>
  <nav>
    <div class="myContainer">
      <!-- Logo -->
      <RouterLink to="/" class="image">
        <img
          src="../assets/img/logo-orizzontale.png"
          alt="logo"
          class="ms-total"
        />
        <img src="../assets/img/logo-b.png" alt="logo-small" class="ms-small" />
      </RouterLink>

      <!-- Search -->
      <AppSearch />

      <!-- Menu -->
      <AppMenu />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  height: 70px;
  width: 100%;
  background-color: rgb(245, 245, 245);
  border-bottom: 1px solid rgb(220, 220, 220);
  //   box-shadow: 0 3px 10px rgb(150, 150, 150);

  .myContainer {
    height: 100%;
    width: 90%;
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  // Logo style
  .image {
    height: 55%;
    img {
      height: 100%;
    }

    .ms-total {
      display: inline-block;
      width: 125px;
    }

    .ms-small {
      display: none;
    }
  }
}
</style>
