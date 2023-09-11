<script>
import { store } from "@/store/store.js";
import AppMenu from "./AppMenu.vue";

export default {
  components: {
    AppMenu,
  },
  data() {
    return {
      store,
      resetPerformed: false,
    };
  },
  methods: {
    resetFilters() {
      this.resetVariables();
      this.resetPerformed = true;
      this.$router.push("/").then(() => {
        this.$router.go(0);
      });
    },

    resetVariables() {
      store.longitude = "";
      store.latitude = "";
      store.radius = 20;
      store.selectedRooms = 1;
      store.selectedBeds = 1;
      store.selectedServices = [];
    },
  },
};
</script>

<template>
  <nav class="shadow-lg">
    <div class="myContainer">
      <!-- Logo -->
      <RouterLink to="/" class="image" @click="resetFilters">
        <img
          src="../assets/img/logo-orizzontale.png"
          alt="logo"
          class="ms-total"
        />
        <img src="../assets/img/logo-b.png" alt="logo-small" class="ms-small" />
      </RouterLink>

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
@media only screen and (max-width: 700px) {
  .myContainer {
    .image {
      .ms-total {
        display: none;
      }

      .ms-small {
        display: inline-block;
      }
    }
  }
}
</style>
