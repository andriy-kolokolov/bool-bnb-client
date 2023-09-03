<script>
import { store } from "@/store/store.js";

export default {
  data() {
    return {
      store,
    };
  },
};
</script>

<template>
  <!-- Logo -->
  <RouterLink to="/" class="image">
    <img src="../assets/img/logo-orizzontale.png" alt="logo" class="ms-total" />
    <img src="../assets/img/logo-b.png" alt="logo-small" class="ms-small" />
  </RouterLink>
</template>

<style lang="scss" scoped>
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

@media only screen and (max-width: 700px) {
  .image {
    .ms-total {
      display: none;
    }

    .ms-small {
      display: inline-block;
    }
  }
}
</style>
