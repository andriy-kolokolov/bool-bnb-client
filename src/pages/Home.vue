<script>
import axios from "axios";
import {store} from "../store/store.js";
export default {
	data() {
		return {
			store,
			arrApartments: [],
		};
	},
	methods: {
		getApartments() {
			axios.get(this.store.baseUrlApi + "apartments/all").then((response) => {
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
		style="width: 18rem">
		<!-- <div>{{ apartment.images[0] }}</div> -->
		<!-- SISTEMARE LA CHIAMATA -->

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
			<li class="list-group-item">SPONSOR: {{ apartment.sponsor }}</li>
			<li class="list-group-item">ZIP: {{ apartment.zip }}</li>
			<li class="list-group-item">CITY: {{ apartment.city }}</li>
			<li class="list-group-item">ADDRESS: {{ apartment.address }}</li>
		</ul>
		<div class="card-body">
			<a href="#" class="card-link">GPS: {{ apartment.gps_coordinates }}</a>
		</div>
	</router-link>
</template>

<style lang="scss" scoped></style>
