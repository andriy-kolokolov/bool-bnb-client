<script>
import axios from "axios";
import { store } from "../store/store.js";
export default {
  data() {
    return {
      store,
      arrApartments: [],
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
  <router-link
    v-for="apartment in arrApartments"
    :key="apartment.id"
    :to="`/apartment/${apartment.id}`"
    class="card"
    style="width: 18rem"
  >
    <img
  				class="main-image"
  				src="https://picsum.photos/id/220/300/300"
  				alt="{{apartment.name}}" />

    <div class="card-body">
      <h5 class="card-title">NAME: {{ apartment.name }}</h5>
      <p class="card-text">ROOMS: {{ apartment.rooms }}</p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">BEDS: {{ apartment.beds }}</li>
      <li class="list-group-item">BATHROOMS: {{ apartment.bathrooms }}</li>
      <li class="list-group-item">
        SQAURE METERS: {{ apartment.square_meters }}
      </li>
      <li class="list-group-item">AVAILABLE: {{ apartment.is_available }}</li>
    </ul>
  </router-link>
</template>

<style lang="scss" scoped></style>
