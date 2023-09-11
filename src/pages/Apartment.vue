<script>
import axios from "axios";
import {store} from "../store/store.js";
import ttstyle from "../store/ttstyle.json";
import AOS from "aos";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "@tomtom-international/web-sdk-services/dist/services-web.min.js";
import Loading from "../components/Loading.vue";

export default {
	components: {
		Loading,
	},
	data() {
		return {
			store,
			isLoading: false,
			isLoad: false,
			apartment: null,
			isSponsored: false,
			latitude: null,
			longitude: null,
			isOwner: false,
			map: null,
		};
	},

	methods: {
		loadApartment() {
			this.isLoad = false;
			this.isLoading = true;
			// Reset Coordinates
			this.latitude = null;
			this.longitude = null;

			const id = this.$route.params.id;

			axios.get(`${this.store.baseUrlApi}apartments/${id}`).then((response) => {
				this.apartment = response.data;
				this.getCoordinates(); // Get GPS coordinates from address
				this.isLoading = false;
				this.isLoad = true;
			});
			axios
				.post(store.baseUrlApi + `apartments/${id}/register-apartment-view`)
				.then((response) => {
					console.log(response.data);
				});
		},

		getCoordinates() {
			const address = `${this.apartment.address.street}, ${this.apartment.address.zip} ${this.apartment.address.city}`;
			const apiKey = "pIZDc5arEQSAalGkANUN2J8fiekVOefL";
			const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
				address,
			)}.json?key=${apiKey}`;

			axios.get(url).then((response) => {
				this.latitude = response.data.results[0].position.lat;
				this.longitude = response.data.results[0].position.lon;

				// Richiama la funzione di inizializzazione della mappa
				this.initializeMap();
			});
		},

		initializeMap() {
			const mapElement = document.getElementById("map");

			if (mapElement && this.latitude && this.longitude) {
				tt.setProductInfo("<Your-Product-Name>", "<Your-Product-Version>");
				const map = tt.map({
					key: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
					container: this.$refs.mapRef,
					center: [this.longitude, this.latitude],
					zoom: 17,
					style: ttstyle,
				});
				map.scrollZoom.disable();
				map.addControl(new tt.NavigationControl());

				// Add a Pin to map
				const element = document.createElement("div");
				element.id = "marker";

				map.on("load", () => {
					new tt.Marker({element: this.$refs.markerRef})
						.setLngLat([this.longitude, this.latitude])
						.addTo(map);
				});
			} else {
				setTimeout(() => this.initializeMap(), 1000);
			}
		},
		getApartmentCoverImage(apartment) {
			return this.store.backEndStorageURL + apartment.images[0].image_path;
		},
		getApartmentImageById(id) {
			return (
				this.store.backEndStorageURL + this.apartment.images[id].image_path
			);
		},
	},

	created() {
		this.loadApartment();
	},

	mounted() {
		AOS.init({duration: 800, delay: 100});
	},
};
</script>

<template>
	<Loading v-if="this.isLoading" />
	<div v-if="this.isLoad">
		<div v-if="apartment" class="container-fluid">
			<h1>
				{{ apartment.name }}
				<span class="badge" v-if="apartment.is_sponsored">
					<i class="fa-solid fa-medal"></i
				></span>
			</h1>
			<div class="grid-container">
				<img
					class="img-wrapper__img"
					:src="getApartmentCoverImage(apartment)"
					alt="{{apartment.name}}"
					data-bs-toggle="offcanvas"
					data-bs-target="#offcanvasBottom"
					aria-controls="offcanvasBottom" />
				<img
					class="middle-image-top"
					:src="getApartmentImageById(1)"
					alt="{{apartment.name}}" />
				<img
					class="middle-image-bottom"
					:src="getApartmentImageById(2)"
					alt="{{apartment.name}}" />
				<img
					class="end-image-top"
					:src="getApartmentImageById(3)"
					alt="{{apartment.name}}" />
				<img
					class="end-image-bottom"
					:src="getApartmentImageById(4)"
					alt="{{ apartment.name }}" />
			</div>

			<div class="container-sticky">
				<div class="details">
					<!-- Host name -->
					<div class="details-section">
						<h3>
							Host: {{ apartment.user.name + " " + apartment.user.last_name }}
						</h3>

						<!-- General information -->
						<div class="general">
							<p class="info-wrapper__details-card">
								<span class="apartment-icon">
									<i class="fa-solid fa-door-open"></i>
								</span>
								Rooms: <strong>{{ apartment.rooms }}</strong>
							</p>
							<p class="info-wrapper__details-card">
								<span class="apartment-icon">
									<i class="fa-solid fa-bed"></i>
								</span>
								Beds:
								<strong>{{ apartment.beds }}</strong>
							</p>
							<p class="info-wrapper__details-card">
								<span class="apartment-icon">
									<i class="fa-solid fa-bath"></i>
								</span>
								Bathrooms:
								<strong>{{ apartment.bathrooms }}</strong>
							</p>
							<p class="info-wrapper__details-card">
								<span class="apartment-icon">
									<i class="fa-solid fa-person-shelter"></i>
								</span>
								Footage:
								<strong>{{ apartment.square_meters }} mq</strong>
							</p>
						</div>
					</div>

					<!-- Additional Information -->
					<!-- <div class="details-section more-info" data-aos="fade-up-right"> -->

					<!-- List of Services -->
					<div class="details-section" data-aos="fade-up-right">
						<h3>What you will find</h3>
						<ul>
							<li v-for="service in apartment.services" :key="service.id">
								<span class="icon"><i :class="service.icon"></i></span>
								<span class="service">{{ service.name }}</span>
							</li>
						</ul>
					</div>

					<!-- Address -->
					<div class="details-section" data-aos="fade-up-right">
						<h3>Where you will be</h3>
						<p class="address">
							<i class="fa-solid fa-location-dot"></i>
							{{ apartment.address.street }} • {{ apartment.address.zip }}
							{{ apartment.address.city }}
						</p>
					</div>
				</div>

				<!-- Sticky element on right side of page -->
				<div class="content">
					<div class="sticky-element">
						<h6 class="message">
							If you need further information, please click on the button below
							to send a message to the Host!
						</h6>
						<router-link
							:to="{
								name: 'message',
								params: {id: apartment.id},
							}"
							class="button-general message-button">
							Contact the Host
						</router-link>
					</div>
				</div>
			</div>

			<!-- TomTom map -->
			<div data-aos="fade-up-left" id="map" ref="mapRef"></div>
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
				<button type="button" class="close-btn" data-bs-dismiss="offcanvas">
					<i class="fa-solid fa-chevron-left"></i>
				</button>
			</div>
			<div class="offcanvas-body">
				<div class="offcanvas-images">
					<img
						class="img-wrapper__img"
						:src="getApartmentCoverImage(apartment)"
						alt="{{apartment.name}}" />
					<img
						class="apartment-image"
						:src="getApartmentImageById(1)"
						alt="{{apartment.name}}" />
					<img
						class="apartment-image"
						:src="getApartmentImageById(2)"
						alt="{{apartment.name}}" />
					<img
						class="apartment-image"
						:src="getApartmentImageById(3)"
						alt="{{apartment.name}}" />
					<img
						class="apartment-image"
						:src="getApartmentImageById(4)"
						alt="{{apartment.name}}" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/ms-variables" as *;

.container-fluid {
	max-width: 80vw;
}

h1 {
	font-weight: 600;
	margin: 2rem 0;
}

.button-general {
	border: none;
	border-radius: 10px;
	padding: 0.5rem 1.5rem;
	font-size: 1rem;
	font-weight: 600;
}

.close-btn {
	width: 30px;
	height: 30px;
	border: none;
	background-color: $ms-color-light;
	border-radius: 50%;
	color: $ms-color-dark;
	transition: all 250ms;

	&:hover {
		background-color: $ms-color-purple;
		color: $ms-color-light;
	}
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
		transform: scale(1);
		filter: brightness(1);
		transition: all 300ms ease-in-out;

		&:hover {
			transform: scale(1.03);
			filter: brightness(1.15);
		}
	}

	.img-wrapper__img {
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

.general {
	display: flex;
	flex-direction: column;
	align-items: start;

	i {
		color: $ms-color-blue;
		width: 2rem;
		align-self: center;
	}
}
.more-info {
	font-size: 1rem;
	font-weight: 300;

	.none {
		display: none;
	}
}

.address {
	font-size: 1.3rem;

	i {
		color: $ms-color-blue;
		margin-right: 0.75rem;
	}
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

	.sticky-element {
		margin: auto 0 0 auto;
		position: sticky;
		top: 1rem;
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
		background-color: $ms-color-light;
		border: 1px solid $ms-color-purple;
		border-radius: 20px;
		box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
			-5px 5px 5px rgba(120, 120, 120, 0.4);

		.message {
			display: block;
			font-size: clamp(1rem, 1.8vw, 1.3rem);
			line-height: 2rem;
		}

		.message-button {
			background-color: $ms-color-blue;
			color: $ms-color-light;
			text-decoration: none;
		}
	}
}

.details-section {
	width: 100%;
	padding-bottom: 3rem;
	border-bottom: 1px solid $ms-color-purple;
	margin-bottom: 1rem;

	h3 {
		margin-bottom: 1rem;
		font-size: 1.6rem;
		font-weight: 600;
	}

	.info-wrapper__details-card {
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
		color: $ms-color-purple;
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
	border: 1px solid $ms-color-dark;
	border-radius: 20px;
}

#marker {
	background-image: url("../assets/img/pin-48.png");
	width: 45px;
	height: 55px;
	background-size: contain;
	background-position: center center;
	background-repeat: no-repeat;
	color: $ms-color-blue !important;
}

.badge {
	color: $ms-color-purple;
	font-size: 1.5rem;
}

.offcanvas-header,
.offcanvas-body {
	margin: auto;
	width: 743px;
}

.offcanvas-title {
	font-weight: bold;
}

.offcanvas-images {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;
	align-content: center;
	justify-content: center;

	.img-wrapper__img {
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
		.img-wrapper__img {
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

		.sticky-element {
			top: 0;
			right: 0;
			width: 100%;
			min-height: 0;
			height: 10vh;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: $ms-color-light;
			border-top: 1px solid $ms-color-purple;
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

		.info-wrapper__details-card {
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
