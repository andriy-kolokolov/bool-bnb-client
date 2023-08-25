<script>
import axios from "axios";
import { store } from "../store/store.js";
import { ref } from "vue";
export default {
  data() {
    return {
      store,
      arrApartments: [],
      showImg: ref(-1),
    };
  },
  methods: {
    getApartments() {
      axios.get(this.store.baseUrlApi + "apartments").then((response) => {
        this.arrApartments = response.data;
      });
      console.log(this.arrApartments);
    },
  },
  created() {
    this.getApartments();
  },
};
</script>

<template>
  <div class="style">
    <router-link
      :to="`/apartment/${apartment.id}`"
      v-for="(apartment, index) in arrApartments"
      :key="apartment.id"
      class="routerstyle"
      @mouseover="showImg = index"
      @mouseout="showImg = ''"
    >
      <div class="apartment_cards">
        <img
          class="cover_img"
          :src="apartment.images[0].image_path"
          :alt="apartment.name"
        />
        <!-- <img
          v-if="index === showImg"
          :src="apartment.images[1].image_path"
          :alt="apartment.name"
        /> -->
        <div class="info">
          <h5>{{ apartment.name }}</h5>
          <p>AVAILABLE: {{ apartment.is_available }}</p>
          <p>SPONSOR: {{ apartment.is_sponsored }}</p>
          <p>CITY: {{ apartment.addresses[0].city }}</p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.style {
  width: fit-content;
  display: flex;
  flex-wrap: wrap;
  gap: 4em;
  align-content: center;
  justify-content: center;
  .routerstyle {
    text-decoration: none;
    .apartment_cards {
      width: 15vw;
      min-width: 300px;
      height: 50vh;
      display: flex;
      position: relative;

      &:hover img {
        bottom: 100px;
        transition: 0.5s ease;
      }

      // &:hover .info {
      //   opacity: 1;
      //   transition: 0.2s ease;
      // }

      img {
        width: 100%;
        height: 40vh;
        border-radius: 20px;
        object-fit: cover;
        position: absolute;
        bottom: 20px;
        left: 0;
        z-index: -100;
        transition: 0.5s ease;
      }

      .info {
        // position: absolute;
        // bottom: 0;
        // left: 0;
        // opacity: 0;
        width: 100%;
        height: 20vh;
        background-color: rgb(235, 235, 235);
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        align-self: end;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 0;

        p,
        h5 {
          margin: 0;
          text-align: center;
          color: rgb(0, 0, 0);
          // transition: 0.2s ease;
        }
      }
    }
  }
}
</style>
