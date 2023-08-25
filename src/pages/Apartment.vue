<script>
import axios from "axios";
import {store} from "../store/store.js";
import ttstyle from "../store/ttstyle.json";
import AOS from "aos";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "@tomtom-international/web-sdk-services/dist/services-web.min.js";

export default {
	data() {
		return {
			store,
			apartment: null,
			isSponsored: false,
			latitude: null,
			longitude: null,
			isOwner: false,
			map: null,
		};
	},

	methods: {
		// 	calculateDistance(long1, lat1, long2, lat2) {
		// 		tt.services
		// 			.calculateRoute({
		// 				key: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
		// 				locations: [long1, lat1, long2, lat2],
		// 			})
		// 			.go()
		// 			.then((response) => {
		// 				const distance = response.routes[0].summary.lengthInMeters;
		// 				console.log(`La distanza è ${distance / 1000} km`);
		// 			});
		// 	},

		loadApartment() {
			// Reset Coordinates
			this.latitude = null;
			this.longitude = null;

			const id = this.$route.params.id;
			console.log(`${this.store.baseUrlApi}apartments/${id}`);
			axios.get(`${this.store.baseUrlApi}apartments/${id}`).then((response) => {
				this.apartment = response.data;
				console.log(this.apartment);

				this.getCoordinates(); // Get GPS coordinates from address
			});
		},

		getCoordinates() {
			const address = "Piazza dei Re di Roma, 50, 00183 Roma";
			const apiKey = "pIZDc5arEQSAalGkANUN2J8fiekVOefL";
			const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
				address,
			)}.json?key=${apiKey}`;

			console.log("Geocodifica dell'indirizzo...");
			axios.get(url).then((response) => {
				this.latitude = response.data.results[0].position.lat;
				this.longitude = response.data.results[0].position.lon;
				console.log("Coordinates OK: ", this.longitude, this.latitude);

				// Richiama la funzione di inizializzazione della mappa
				this.initializeMap();
			});
		},

		initializeMap() {
			const mapElement = document.getElementById("map");

			if (mapElement && this.latitude && this.longitude) {
				console.log("Elemento 'map' trovato. Inizializzazione della mappa...");
				tt.setProductInfo("<Your-Product-Name>", "<Your-Product-Version>");
				const map = tt.map({
					key: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
					container: this.$refs.mapRef,
					center: [this.longitude, this.latitude],
					zoom: 17,
					style: ttstyle,
				});

				// Add a Pin to map
				map.on("load", () => {
					new tt.Marker().setLngLat([this.longitude, this.latitude]).addTo(map);
				});
			} else {
				console.log(
					"Elemento 'map' non trovato. Riprovare tra 100 millisecondi...",
				);
				setTimeout(() => this.initializeMap(), 1000);
			}
		},
	},

	created() {
		// Get coordinates for GPS map and distance
		this.loadApartment();
	},

	mounted() {
		AOS.init();
	},
};
</script>

<template>
	<div v-if="apartment" class="container">
		<h1>{{ apartment.name }}</h1>
		<!-- <img
			class="main-img"
			:src="apartment.images[0].image_path"
			alt="{{apartment.name}}" /> -->
		<div class="grid-container">
			<img
				class="main-image"
				src="https://picsum.photos/id/220/300/300"
				alt="{{apartment.name}}" />

			<img
				class="middle-image"
				src="https://picsum.photos/id/230/300/300"
				alt="{{apartment.name}}" />
			<img
				class="middle-image"
				src="https://picsum.photos/id/140/300/300"
				alt="{{apartment.name}}" />
			<img
				class="end-image"
				src="https://picsum.photos/id/125/300/300"
				alt="{{apartment.name}}" />
			<img
				class="end-image"
				src="https://picsum.photos/id/440/300/300"
				alt="{{apartment.name}}" />
		</div>
		<p class="apartment-data">
			Rooms: {{ apartment.rooms }} • Beds: {{ apartment.beds }} • Bathrooms:
			{{ apartment.bathrooms }} • Footage: {{ apartment.square_meters }} mq
		</p>
	</div>

	<!-- Accesso ai servizi utilizzando un loop -->
	<ul>
		<li v-for="service in apartment.services" :key="service.id">
			{{ service.icon }} {{ service.name }}
		</li>
	</ul>
	<!-- Utilizzo della variabile isSponsored -->
	<p v-if="isSponsored">SPONSORED</p>
	<!-- Address -->
	<h3>Where you will be</h3>
	<p>{{ apartment.addresses[0].street }}</p>
	<p>{{ apartment.addresses[0].zip }} • {{ apartment.addresses[0].city }}</p>
	<!-- TomTom map -->
	<div id="map" ref="mapRef"></div>

	<!-- Button for Send Email or Back if owner  -->
	<!-- <router-link class="button-link" v-if="!isOwner">Send Email</router-link>
		<router-link class="button-link" v-if="isOwner">Go Back</router-link> -->
</template>

<style lang="scss" scoped>
@use "../assets/partials/variables" as *;

h1 {
	font-weight: 600;
}

.grid-container {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(2, 1fr);
	gap: 10px; /* Spazio tra le celle */
}

.main-image {
	grid-column: 1 / 3;
	grid-row: 1 / 3;
}

.middle-image {
	grid-column: 3;
	grid-row: auto;
}

.end-image {
	grid-column: 4;
	grid-row: auto;
}

.apartment-data {
	font-size: 1.2rem;
}

.main-img {
	border-radius: 20px 0 0 20px;
	margin: 1rem 0;
	box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.5);
	grid-row: span 2;
}

.middle-img {
	margin: 1rem 1rem;
	box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.5);
	grid-row: span 1;
}

#map {
	width: 60%;
	aspect-ratio: 3/2;
	margin: 2rem auto;
	box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.5);
	border: 1px solid $color-dark;
}
</style>
