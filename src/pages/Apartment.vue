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
				map.scrollZoom.disable();

				// Add a Pin to map
				const element = document.createElement("div");
				element.id = "marker";

				map.on("load", () => {
					new tt.Marker({element: this.$refs.markerRef})
						.setLngLat([this.longitude, this.latitude])
						.addTo(map);
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
		this.loadApartment();
	},

	mounted() {
		AOS.init({duration: 800, delay: 300});
	},
};
</script>

<template>
	<div v-if="apartment" class="container-fluid">
		<h1>{{ apartment.name }}</h1>
		<!-- <img
			class="main-img"
			:src="apartment.images[0].image_path"
			alt="{{apartment.name}}" /> -->
		<div class="grid-container">
			<img
				class="main-image"
				src="https://picsum.photos/id/220/300/300"
				alt="{{apartment.name}}"
				data-bs-toggle="offcanvas"
				data-bs-target="#offcanvasBottom"
				aria-controls="offcanvasBottom" />
			<img
				class="middle-image-top"
				src="https://picsum.photos/id/230/300/300"
				alt="{{apartment.name}}" />
			<img
				class="middle-image-bottom"
				src="https://picsum.photos/id/140/300/300"
				alt="{{apartment.name}}" />
			<img
				class="end-image-top"
				src="https://picsum.photos/id/125/300/300"
				alt="{{apartment.name}}" />
			<img
				class="end-image-bottom"
				src="https://picsum.photos/id/440/300/300"
				alt="{{ apartment.name }}" />
		</div>

		<div class="container-sticky">
			<div class="details">
				<!-- Host name -->
				<div class="details-section">
					<h3>Host: {{ apartment.user.username }}</h3>

					<!-- General information -->
					<p class="apartment-data">
						Rooms: {{ apartment.rooms }} • Beds: {{ apartment.beds }} •
						Bathrooms: {{ apartment.bathrooms }} • Footage:
						{{ apartment.square_meters }} mq
					</p>
				</div>

				<!-- List of Services -->
				<div class="details-section" data-aos="fade-up-right">
					<h3>What you will find</h3>
					<ul>
						<li v-for="service in apartment.services" :key="service.id">
							<span class="icon">{{ service.icon }}</span>
							<span class="service">{{ service.name }}</span>
						</li>
					</ul>
				</div>

				<!-- Utilizzo della variabile isSponsored -->
				<p v-if="apartment.isSponsored">SPONSORED</p>

				<!-- Address -->
				<div class="details-section" data-aos="fade-up-right">
					<h3>Where you will be</h3>
					<p>{{ apartment.address.street }}</p>
					<p>{{ apartment.address.zip }} • {{ apartment.address.city }}</p>
				</div>
			</div>

			<!-- Sticky modal on right side of page -->
			<div class="content">
				<div class="sticky-modal">
					<h6 class="message">
						If you need further information, please click on the button below to
						send a message to the Host!
					</h6>
					<button
						data-bs-toggle="modal"
						data-bs-target="#staticBackdrop"
						class="message-button">
						Send a Message
					</button>
				</div>
			</div>
		</div>

		<!-- TomTom map -->
		<div data-aos="fade-up-right" id="map" ref="mapRef"></div>
		<div id="marker" ref="markerRef"></div>
	</div>

	<!-- OFFCANVAS -->
	<div
		v-if="apartment"
		class="offcanvas offcanvas-bottom w-100 h-100"
		tabindex="-1"
		id="offcanvasBottom"
		aria-labelledby="offcanvasBottomLabel">
		<div class="offcanvas-header">
			<h5 class="offcanvas-title" id="offcanvasBottomLabel">
				{{ apartment.name }}
			</h5>
			<button
				type="button"
				class="close-btn"
				data-bs-dismiss="offcanvas"
				aria-label="Close">
				<i class="fa-solid fa-chevron-left"></i>
			</button>
		</div>
		<div class="offcanvas-body">
			<div class="offcanvas-images">
				<img
					class="main-image"
					src="https://picsum.photos/id/220/300/300"
					alt="{{apartment.name}}" />
				<img
					class="apartment-image"
					src="https://picsum.photos/id/230/300/300"
					alt="{{apartment.name}}" />
				<img
					class="apartment-image"
					src="https://picsum.photos/id/140/300/300"
					alt="{{apartment.name}}" />
				<img
					class="apartment-image"
					src="https://picsum.photos/id/125/300/300"
					alt="{{apartment.name}}" />
				<img
					class="apartment-image"
					src="https://picsum.photos/id/440/300/300"
					alt="{{apartment.name}}" />
			</div>
		</div>
	</div>

	<!-- MODAL -->
	<div
		class="modal fade"
		id="staticBackdrop"
		data-bs-backdrop="static"
		data-bs-keyboard="false"
		tabindex="-1"
		aria-labelledby="staticBackdropLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">...</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal">
						Close
					</button>
					<button type="button" class="btn btn-primary">Understood</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/variables" as *;

.container-fluid {
	max-width: 80vw;
}

h1 {
	font-weight: 600;
	margin: 2rem 0;
}

.grid-container {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(2, 1fr);
	gap: 1rem;
	margin-bottom: 2rem;

	img {
		width: 100%;
		aspect-ratio: 3 / 2.5;
		object-fit: cover;
		object-position: center;
		box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
			-5px 5px 5px rgba(120, 120, 120, 0.4);
	}

	.main-image {
		grid-column: 1 / 3;
		grid-row: 1 / 3;
		border-radius: 20px 0 0 20px;
		cursor: pointer;
	}

	.middle-image-top {
		grid-column: 3 /4;
		grid-row: 1 / 2;
	}

	.middle-image-bottom {
		grid-column: 3 /4;
		grid-row: 2 / 3;
	}

	.end-image-top {
		grid-column: 4 / 5;
		grid-row: 1 / 2;
		border-radius: 0 20px 0 0;
	}

	.end-image-bottom {
		grid-column: 4 / 5;
		grid-row: 2 / 3;
		border-radius: 0 0 20px 0;
	}
}

.details {
	width: 65%;
}

.container-sticky {
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	.content {
		width: 25%;
		position: relative;
	}

	.sticky-modal {
		margin: auto 0 0 auto;
		position: sticky;
		top: 0;
		right: 0;
		width: 100%;
		min-height: 40vh;
		height: fit-content;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 2rem 3rem;
		text-align: center;
		background-color: $color-light;
		border: 1px solid $color-purple;
		border-radius: 20px;
		box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
			-5px 5px 5px rgba(120, 120, 120, 0.4);

		.message {
			display: block;
			font-size: 1.2rem;
			line-height: 2rem;
		}

		.message-button {
			border: none;
			border-radius: 0.5rem;
			padding: 0.7rem 1.5rem;
			font-size: 1.1rem;
			font-weight: 600;
			background-color: $color-blue;
			color: $color-light;
		}
	}
}

.details-section {
	width: 100%;
	padding-bottom: 3rem;
	border-bottom: 1px solid $color-purple;
	margin-bottom: 1rem;

	h3 {
		margin-bottom: 1rem;
		font-size: 1.6rem;
		font-weight: 600;
	}

	.apartment-data {
		font-size: 1.2rem;
		margin: 1rem 0;
	}
}

.details-section:last-child {
	max-width: 100%;
	padding-bottom: 1rem;
	border: none;
}

ul {
	list-style: none;
	margin: 0;
	padding: 0;

	.icon {
		color: $color-purple;
		margin-right: 1rem;
	}

	.service {
		font-style: italic;
		line-height: 2.5rem;
	}
}

#map {
	width: 100%;
	aspect-ratio: 2 / 1;
	margin-top: 1rem;
	margin-bottom: 7rem;
	box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
		-5px 5px 5px rgba(120, 120, 120, 0.4);
	border: 1px solid $color-dark;
	border-radius: 20px;
}

#marker {
	background-image: url("../assets/img/pin-48.png");
	width: 45px;
	height: 55px;
	background-size: contain;
	background-position: center center;
	background-repeat: no-repeat;
	color: blue !important;
}

.offcanvas-header,
.offcanvas-body {
	margin: auto;
	width: 743px;
}

.offcanvas-title {
	font-weight: bold;
}

.close-btn {
	width: 30px;
	height: 30px;
	border: none;
	background-color: $color-light;
	border-radius: 50%;
	color: $color-dark;
	transition: all 250ms;

	&:hover {
		background-color: $color-purple;
		color: $color-light;
	}
}

.offcanvas-images {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;
	align-content: center;
	justify-content: center;

	.main-image {
		width: 100%;
		aspect-ratio: 2 / 1.5;
	}
	.apartment-image {
		width: calc((100% - 1rem) / 2);
	}

	img {
		aspect-ratio: 1 / 1;
		border-radius: 20px;
		object-fit: cover;
		box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.3),
			-5px 5px 5px rgba(120, 120, 120, 0.3);
		transform: scale(0.9);
		filter: brightness(0.6);
		transition: all 250ms ease-in-out;

		&:hover {
			transform: scale(1);
			filter: brightness(1);
		}
	}
}

@media only screen and (max-width: 743px) {
	.grid-container {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;

		.middle-image-top,
		.middle-image-bottom,
		.end-image-top,
		.end-image-bottom {
			display: none;
		}
		.main-image {
			width: 100%;
			grid-column: 1 / -1;
			grid-row: 1 / -1;
			border-radius: 20px;
		}
	}

	.offcanvas-header,
	.offcanvas-body {
		width: 100%;
	}

	#map {
		width: 100%;
		margin-bottom: 15vh;
		aspect-ratio: 3 / 2;
		border-radius: 20px;
	}

	.container-sticky {
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: column;

		.content {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			z-index: 100;
		}

		.sticky-modal {
			top: 0;
			right: 0;
			width: 100%;
			height: 10vh;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: $color-light;
			border-top: 1px solid $color-purple;
			border-radius: 0;
			box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
				-5px 5px 5px rgba(120, 120, 120, 0.4);

			.message {
				display: none;
			}
		}
	}

	.details-section {
		padding: 0.5rem;

		.apartment-data {
			font-size: 1.2rem;
			margin: 1rem 0;
		}
	}

	.details-section:last-child {
		max-width: 100%;
		padding-bottom: 0;
		border: none;
	}
}
</style>
