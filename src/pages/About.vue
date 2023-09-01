<script>
import axios from "axios";
import {mapState} from "vuex";

export default {
	data() {
		return {
			query: "",
			apiKey: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
			suggestions: [],
			street: "",
			zip: "",
			city: "",
			longitude: "",
			latitude: "",
		};
	},

	methods: {
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
				this.latitude = response.data.results[0].position.lat;
				this.longitude = response.data.results[0].position.lon;
				console.log(
					"Longitude: ",
					this.longitude,
					" - Latitude: ",
					this.latitude,
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

		performSearch() {
			const url = `https://api.tomtom.com/search/2/nearbySearch/.json`;
			axios
				.get(url, {
					params: {
						key: this.apiKey,
						countrySet: "IT",
						language: "it-IT",
						lat: this.latitude,
						lon: this.longitude,
						radius: this.radius,
					},
				})
				.then((response) => {
					console.log(response.data);
				});
		},
	},

	computed: {
		...mapState(["radius"]),
	},

	watch: {
		radius(newVal, oldVal) {
			console.log("Nuovo valore di radius:", newVal, "Vecchio valore:", oldVal);
			if (newVal !== oldVal) {
				this.performSearch();
			}
		},
	},
};
</script>

<template>
	<h1>ABOUT PAGE</h1>
	<div class="container">
		<h2>Ricerca tramite indirizzo</h2>
		<h2>e estrazione coordinate GPS</h2>
		<div class="search-box">
			<input
				type="text"
				v-model="query"
				@input="getSuggestions"
				@focus="clearInput" />
			<select v-if="suggestions.length > 0" ref="selectBox" size="5">
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
		<p>L'indirizzo inserito è: {{ street }}, {{ zip }} {{ city }}</p>
		<p>
			Le coordinate sono: Longitudine {{ longitude }}, Latitudine {{ latitude }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.search-box {
	display: flex;
	flex-direction: column;
}
</style>
