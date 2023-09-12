<script>
import axios from "axios";
import {store} from "../store/store.js";
import Loading from "../components/Loading.vue";
import ApartmentCard from "../components/ApartmentCard.vue";
import loading from "@/components/Loading.vue";

export default {
	computed: {
		loading() {
			return loading;
		},
	},
	components: {
		Loading,
		ApartmentCard,
	},
	data() {
		return {
			store,
			gettingApartments: true,
			isLoading: true,
			arrApartments: [],
			sponsoredApartments: [],
			nonSponsoredApartments: [],
			arrServices: [],
			arrCoverImg: [],
			maxBeds: 0,
			maxRooms: 0,
			query: "",
			apiKey: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
			suggestions: [],
			street: "",
			zip: "",
			city: "",
		};
	},
	methods: {
		loadData() {
			axios.get(`${this.store.baseUrlApi}apartments/`).then((response) => {
				this.gettingApartments = false;
				this.isLoading = true;
				this.arrApartments = response.data;
				this.filterApartments();

				response.data.forEach((item) => {
					// Controllo l'appartamento con più stanze
					if (item.rooms) {
						if (item.rooms > this.maxRooms) {
							this.maxRooms = item.rooms;
						}
					}

					// Controllo l'appartamento con più letti
					if (item.beds) {
						if (item.beds > this.maxBeds) {
							this.maxBeds = item.beds;
						}
					}

					// Estraggo i dati dei services per inserirli in un array vuoto
					if (item.services && item.services.length > 0) {
						item.services.forEach((service) => {
							// Verifico se il servizio è già presente nell'array arrServices
							const ServiceExist = this.arrServices.some(
								(existingService) => existingService.id === service.id,
							);

							if (!ServiceExist) {
								this.arrServices.push(service);
							}
						});
					}
				});
				console.log("Beds: " + this.maxBeds);
				console.log("Rooms: " + this.maxRooms);
				// Ordino gli ID dei servizi arrServices in ordine crescente
				this.arrServices.sort((a, b) => a.id - b.id);
				console.log(this.arrServices);

				// RESET VARIABLES
				store.longitude = "";
				store.latitude = "";
				store.radius = 20;
				store.selectedRooms = 1;
				store.selectedBeds = 1;
				store.selectedServices = [];
				this.clearInput();

				setTimeout(() => {
					this.gettingApartments = true;
					document.body.style.overflow = "hidden";

					setTimeout(() => {
						this.isLoading = false;
						document.body.style.overflow = "auto";
					}, 520);
				}, 0);
			});
		},

		getSuggestions() {
			if (this.query.length >= 2) {
				axios
					.get(`https://api.tomtom.com/search/2/search/${this.query}.json`, {
						params: {
							key: this.apiKey,
							countrySet: "IT",
							language: "it-IT",
						},
					})
					.then((response) => {
						this.suggestions = response.data.results.map(
							(result) => result.address.freeformAddress,
						);
					});
			}
		},

		selectSuggestion(suggestionOrEvent) {
			if (typeof suggestionOrEvent === "string") {
				this.query = suggestionOrEvent;
			} else if (suggestionOrEvent.target) {
				this.query = suggestionOrEvent.target.value;
			}
			this.suggestions = [];
			this.getCoordinates(this.query);
			this.parseAddress(this.query);
		},

		getCoordinates(address) {
			const apiKey = "pIZDc5arEQSAalGkANUN2J8fiekVOefL";
			const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
				address,
			)}.json?key=${apiKey}`;

			axios.get(url).then((response) => {
				store.latitude = response.data.results[0].position.lat;
				store.longitude = response.data.results[0].position.lon;
				console.log(
					"Longitude: ",
					store.longitude,
					" - Latitude: ",
					store.latitude,
				);
			});
		},

		clearInput() {
			this.query = "";
		},

		parseAddress(address) {
			const parts = address.split(", ");
			const [streetAndNumber, zipAndCity] = parts;
			const [zip, city] = zipAndCity.split(" ");

			this.street = streetAndNumber;
			this.zip = zip;
			this.city = city;
			console.log(this.street, " - ", this.zip, " - ", this.city);
		},

		formatDistance(distance) {
			return `Distance: ${distance.toFixed(1)} Km`;
		},

		getFilteredApartments() {
			this.gettingApartments = false;
			this.isLoading = true;
			this.arrApartments = [];
			const selectedServiceNames = store.selectedServices
				.map((id) => {
					const service = this.arrServices.find((service) => service.id === id);
					return service ? service.name : null;
				})
				.filter((name) => name !== null);
			axios
				.get(store.baseUrlApi + "search", {
					params: {
						lat: parseFloat(store.latitude),
						lon: parseFloat(store.longitude),
						radius: store.radius,
						min_beds: store.selectedBeds,
						min_rooms: store.selectedRooms,
						required_services: selectedServiceNames,
					},
				})
				.then((response) => {
					this.arrApartments = response.data.apartments;
					this.filterApartments();

					setTimeout(() => {
						this.gettingApartments = true;
						document.body.style.overflow = "hidden";

						setTimeout(() => {
							this.isLoading = false;
							document.body.style.overflow = "auto";
						}, 520);
					}, 0);
				});
		},

		filterApartments() {
			// Verifica se l'array arrApartments è nullo o vuoto prima di filtrarlo
			if (this.arrApartments && this.arrApartments.length > 0) {
				this.sponsoredApartments = this.arrApartments.filter(
					(apartment) => apartment.is_sponsored,
				);
				this.nonSponsoredApartments = this.arrApartments.filter(
					(apartment) => !apartment.is_sponsored,
				);
			} else {
				// Gestire il caso in cui non ci sono appartamenti
				// Puoi impostare this.sponsoredApartments e this.nonSponsoredApartments come vuoti o fare altro, a seconda delle tue esigenze
				this.sponsoredApartments = [];
				this.nonSponsoredApartments = [];
			}
		},
	},
	created() {
		this.loadData();
	},
	watch: {
		"store.radius"(newRadius) {
			store.radius = newRadius;
		},
	},
	mounted() {
		// Popola l'array arrApartments con i dati degli appartamenti
		this.arrApartments = [
			// Inserisci i dati degli appartamenti qui
		];

		// Chiama la funzione di filtro
		this.filterApartments();
	},
};
</script>

<template>
	<Loading v-if="this.isLoading" />

	<!--*************************  SEARCH ************************* -->
	<button
		class="mySearch"
		type="button"
		data-bs-toggle="offcanvas"
		data-bs-target="#offcanvas"
		aria-controls="offcanvas">
		Search <i class="fa-solid fa-magnifying-glass"></i>
	</button>

	<div
		class="offcanvas offcanvas-start ms-width"
		tabindex="-1"
		id="offcanvas"
		aria-labelledby="offcanvasTopLabel">
		<div
			class="offcanvas-header d-flex gap-3 align-items-center justify-content-center">
			<button
				type="button"
				class="btn-close"
				data-bs-dismiss="offcanvas"
				aria-label="Close"></button>
		</div>
		<div
			class="offcanvas-body h-100 d-flex align-items-center justify-content-center">
			<form class="h-100 d-flex flex-column align-items-center">
				<!-- input -->
				<div class="input-container mt-3">
					<div class="search-box">
						<label for="SearchBar" class="mx-auto"
							>Search for City or Address</label
						>
						<input
							name="searchBar"
							type="text"
							autocomplete="off"
							class="ms-input"
							v-model="query"
							@input="getSuggestions"
							@focus="clearInput"
							@keydown.enter.prevent />
						<select
							v-if="suggestions.length > 0"
							ref="selectBox"
							size="5"
							class="ms-select-address">
							<option
								v-for="(suggestion, index) in suggestions"
								:key="index"
								:value="suggestion"
								:selected="index === highlighted"
								@click="selectSuggestion(suggestion)">
								{{ suggestion }}
							</option>
						</select>
					</div>
				</div>

				<div v-if="store.latitude" class="refined-search">
					<!-- selects -->
					<div
						class="d-flex flex-column gap-2 align-items-center justify-content-center mt-1">
						<!-- slider -->
						<div class="slidecontainer mt-5">
							<div class="slider-container">
								<input
									type="range"
									name="km"
									min="20"
									max="500"
									class="slider"
									id="myRange"
									v-model="store.radius" />
								<div class="slider-value mt-2">{{ store.radius }} km</div>
							</div>
						</div>

						<div class="mySelects mt-3">
							<div
								class="d-flex flex-column align-items-center justify-content-center">
								<label for="rooms">Rooms</label>
								<select
									class="form-select form-select-sm ms-select"
									name="rooms"
									v-model="store.selectedRooms">
									<option
										v-for="(mr, i) in this.maxRooms"
										:key="i"
										:value="i + 1">
										{{ i + 1 }}
									</option>
								</select>
							</div>
							<div
								class="d-flex flex-column align-items-center justify-content-center">
								<label for="beds">Beds</label>
								<select
									class="form-select form-select-sm ms-select"
									name="beds"
									v-model="store.selectedBeds">
									<option
										v-for="(mb, i) in this.maxBeds"
										:key="i"
										:value="i + 1">
										{{ i + 1 }}
									</option>
								</select>
							</div>
						</div>
					</div>

					<!-- checkbox -->

					<div
						class="check-container d-flex gap-1 flex-column align-items-center row mt-5">
						<label
							v-for="(service, index) in this.arrServices"
							:key="index"
							class="container ms-check-label m-0 col-12"
							>{{ service.name }}
							<input
								type="checkbox"
								v-model="store.selectedServices"
								:value="service.id" />
							<span class="checkmark"></span>
						</label>
					</div>
					<div
						class="mt-5 pb-4 d-flex gap-3 align-items-center justify-content-center">
						<button
							class="back-btn"
							data-bs-dismiss="offcanvas"
							@click.prevent="loadData">
							Reset
						</button>
						<button
							class="inputSearch"
							data-bs-dismiss="offcanvas"
							@click.prevent="getFilteredApartments">
							Search <i class="fa-solid fa-magnifying-glass"></i>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>

	<!-- ************************* APARTMENTS CARDS ************************* -->
	<div class="cards-style" v-if="gettingApartments">
		<div class="center_container" v-if="nonSponsoredApartments.length === 0">
			<div class="center_content text-secondary">
				Oops! No apartments found.
			</div>
		</div>
		<h3 v-else class="text-center">Featured Apartments</h3>
		<div class="style pt-4" v-if="sponsoredApartments.length > 0">
			<router-link
				:to="`/apartment/${apartment.id}`"
				v-for="apartment in sponsoredApartments"
				:key="apartment.id"
				class="routerstyle">
				<ApartmentCard
					:apartment="apartment"
					:formatDistance="formatDistance" />
			</router-link>
		</div>
		<hr class="pb-4 mx-auto" v-if="sponsoredApartments.length > 0" />
		<div class="style" v-if="gettingApartments">
			<router-link
				:to="`/apartment/${apartment.id}`"
				v-for="apartment in nonSponsoredApartments"
				:key="apartment.id"
				class="routerstyle">
				<ApartmentCard
					:apartment="apartment"
					:formatDistance="formatDistance" />
			</router-link>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/ms-variables" as *;

// VUE TRANSITION
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

// NO RESULTS MESSAGE
.center_container {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
}

.center_content {
	text-align: center;
	font-weight: bold;
	font-size: 2rem;
}

// ****************************** STYLE SEARCH ******************************
.mySearch {
	position: absolute;
	top: 18px;
	left: 50%;
	transform: translateX(-50%);
	width: 130px;
	padding: 5px;
	border: 0px;
	border-radius: 20px;
	background-color: $ms-color-blue;
	color: white;
}

.inputSearch {
	width: 130px;
	padding: 5px;
	border: 0px;
	border-radius: 20px;
	background-color: $ms-color-blue;
	color: white;
}

.back-btn {
	width: 150px;
	padding: 5px;
	border: 0px;
	border-radius: 20px;
	background-color: $ms-color-dark;
	color: white;
}

.ms-width {
	width: 500px;
}

// input
.input-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.search-box {
	display: flex;
	flex-direction: column;

	.ms-input {
		outline: none;
		width: 300px;
		border: 2px solid $ms-color-blue;
		border-radius: 5px;
		padding: 5px 15px 5px 15px;
		font-size: 1.3em;
	}

	.ms-select-address {
		width: 300px;
		border: 2px solid $ms-color-blue;
		border-top: none;
		border-radius: 5px;
		padding: 5px 15px 5px 15px;
		font-size: 1.15em;
		scrollbar-color: transparent transparent;
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}
}

// select
.mySelects {
	width: 100%;
	display: flex;
	gap: 2rem;
	align-items: center;
	justify-content: center;
	font-size: 1.15em;
	.ms-select {
		margin-top: 0.3rem;
		width: fit-content;
		outline: none;
	}
}

.slidecontainer {
	width: 100%;
	margin-top: 1rem;
	font-size: 1.15em;
}
.slider-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 0.3rem;
}
.slider {
	width: 100%;
	height: 10px;
	border-radius: 5px;
	background: #d3d3d3;
	outline: none;
	opacity: 0.7;
	-webkit-transition: 0.2s;
	appearance: none;
	transition: opacity 0.2s;

	&:hover {
		opacity: 1;
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: $ms-color-blue;
		cursor: pointer;
	}

	&::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: $ms-color-blue;
		cursor: pointer;
	}
}

.check-container {
	width: fit-content;

	.ms-check-label {
		font-size: 18px;
		line-height: 1.7rem;
		padding-right: 0px;
	}
}
.container {
	display: block;
	position: relative;
	padding-left: 35px;
	margin-bottom: 12px;
	cursor: pointer;
	font-size: 22px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;

	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		position: absolute;
		top: 5px;
		left: 0;
		height: 25px;
		width: 25px;
		background-color: #eee;
	}

	&:hover input ~ .checkmark {
		background-color: #ccc;
	}

	& input:checked ~ .checkmark {
		background-color: $ms-color-blue;
	}

	.checkmark:after {
		content: "";
		position: absolute;
		display: none;
	}

	input:checked ~ .checkmark:after {
		display: block;
	}

	.checkmark:after {
		left: 9px;
		top: 4px;
		width: 7px;
		height: 13px;
		border: solid white;
		border-width: 0 3px 3px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}
}

// ************************* STYLE APARTMENTS CARDS *************************
.cards-style {
	width: 85%;
	min-height: calc(100vh - 120px);
	margin-inline: auto;
	padding-top: 1.5em;
}

hr {
	width: 85%;
}

.style {
	min-height: fit-content;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 3em;
	align-content: center;
	justify-content: center;
	margin-inline: auto;
	padding-top: 1em;
	padding-bottom: 3em;
	.routerstyle {
		text-decoration: none;
		width: calc((100% - 3em) / 7);
		padding-bottom: 1em;
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

@media only screen and (max-width: 2100px) {
	.cards-style {
		width: 95%;
	}
}

@media only screen and (max-width: 1750px) {
	.cards-style {
		width: 95%;
	}
	.style {
		gap: 4em;
		.routerstyle {
			width: calc((100% - 4em) / 6);
		}
	}
}

@media only screen and (max-width: 1500px) {
	.style {
		gap: 4em;
		.routerstyle {
			width: calc((100% - 4em) / 5);
		}
	}
}

@media only screen and (max-width: 1300px) {
	.style {
		gap: 4em;
		.routerstyle {
			width: calc((100% - 4em) / 4);
		}
	}
}

@media only screen and (max-width: 1000px) {
	.style {
		gap: 4em;
		.routerstyle {
			width: calc((100% - 4em) / 3);
		}
	}
}

@media only screen and (max-width: 790px) {
	.style {
		width: 85%;
		gap: 4em;
		.routerstyle {
			width: calc((100% - 4em) / 2);
		}
	}
}

@media only screen and (max-width: 620px) {
	.style {
		gap: 4em;
		.routerstyle {
			width: calc((100% - 4em) / 1);
		}
	}
}
</style>
