<script>
import axios from "axios";

export default {
	data() {
		return {
			query: "",
			apiKey: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
			suggestions: [],
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
			console.log(this.query);
			this.suggestions = [];
			this.getCoordinates(this.query);
		},

		getCoordinates(address) {
			const apiKey = "pIZDc5arEQSAalGkANUN2J8fiekVOefL";
			const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
				address,
			)}.json?key=${apiKey}`;

			axios.get(url).then((response) => {
				this.latitude = response.data.results[0].position.lat;
				this.longitude = response.data.results[0].position.lon;
				console.log(this.longitude, this.latitude);
			});
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
			<input type="text" v-model="query" @input="getSuggestions" />
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
