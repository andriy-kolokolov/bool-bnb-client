<script>
import axios from "axios";
import {store} from "../store/store.js";
import AOS from "aos";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

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
			const id = this.$route.params.id;

			axios.get(`${this.store.baseUrlApi}apartments/${id}`).then((response) => {
				this.apartment = response.data;
				console.log(this.apartment);

				const gpsCoordinates =
					this.apartment.address[0].gps_coordinates.split(",");
				this.latitude = parseFloat(gpsCoordinates[0]);
				this.longitude = parseFloat(gpsCoordinates[1]);

				console.log(this.latitude, this.longitude); // Per confermare che le coordinate siano state ottenute

				this.initMap(); // Ora chiami initMap dopo aver ottenuto le coordinate
			});
		},

		initMap() {
			console.log("Tentativo di inizializzazione della mappa...");

			if (this.latitude && this.longitude) {
				const container = document.getElementById("map");
				if (container) {
					console.log("Contenitore trovato, inizializzazione della mappa...");
					tt.setProductInfo("<Your-Product-Name>", "<Your-Product-Version>");
					this.map = tt.map({
						key: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
						container: "map",
						center: [12.4924, 41.8902], // oppure [this.longitude, this.latitude]
						zoom: 15,
					});
					console.log("Mappa inizializzata con successo.");
				} else {
					console.log("Contenitore non trovato, riprova tra 100ms...");
					setTimeout(() => {
						this.initMap();
					}, 200);
				}
			} else {
				console.log("Latitudine o longitudine non disponibili.");
			}
		},
	},

	created() {
		// Get coordinates for GPS map and distance
		this.loadApartment();
	},

	mounted() {
		AOS.init();
		this.$nextTick(() => {
			this.initMap();
		});
	},
};
</script>

<template>
	<div v-if="apartment" class="container">
		<h1>{{ apartment.name }}</h1>
		<img :src="apartment.images[0].image_path" alt="{{apartment.name}}" />
		<p class="apartment-data">
			Rooms: {{ apartment.rooms }} • Beds: {{ apartment.beds }} • Bathrooms:
			{{ apartment.bathrooms }} • Footage: {{ apartment.square_meters }} mq
		</p>
		<!-- Accesso ai servizi utilizzando un loop -->
		<ul>
			<li v-for="service in apartment.services" :key="service.id">
				{{ service.name }}
			</li>
		</ul>
		<!-- Utilizzo della variabile isSponsored -->
		<p v-if="isSponsored">SPONSORED</p>
		<!-- Address -->
		<h3>Where you will be</h3>
		<p>{{ apartment.address[0].address }}</p>
		<p>{{ apartment.address[0].zip }} • {{ apartment.address[0].city }}</p>
		<!-- TomTom map -->
		<div id="map"></div>

		<!-- Button for Send Email or Back if owner  -->
		<!-- <router-link class="button-link" v-if="!isOwner">Send Email</router-link>
		<router-link class="button-link" v-if="isOwner">Go Back</router-link> -->
	</div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/variables" as *;

h1 {
	font-weight: 600;
}

.apartment-data {
	font-size: 1.2rem;
}

img {
	border-radius: 20px;
	margin: 1rem 0;
	box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.5);
}

#map {
	width: 60%;
	aspect-ratio: 3/2;
	margin: 2rem auto;
	box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.5);
	border: 1px solid $color-dark;
}
</style>
