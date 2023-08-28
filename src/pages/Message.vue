<script>
import axios from "axios";
import {store} from "../store/store.js";
import AOS from "aos";

export default {
	data() {
		return {
			store,
			apartment: null,
		};
	},

	mounted() {
		AOS.init({duration: 800, delay: 300});

		const id = this.$route.params.id;
		axios.get(`${this.store.baseUrlApi}apartments/${id}`).then((response) => {
			this.apartment = response.data;
			console.log(this.apartment);
		});
	},
};
</script>

<template>
	<div v-if="apartment" class="container-fluid">
		<h1>Information request</h1>
		<div class="summary">
			<div class="img-container">
				<img
					class="main-image"
					:src="apartment.images[0].image_path"
					alt="{{apartment.name}}" />
			</div>
			<div class="info-container">
				<h3>
					Location: <span class="data">{{ apartment.name }}</span>
				</h3>
				<h3>
					Host: <span class="data">{{ apartment.user.username }}</span>
				</h3>
				<h3>
					Address:
					<p class="data">{{ apartment.address.street }}</p>
					<p class="data">
						{{ apartment.address.zip }} • {{ apartment.address.city }}
					</p>
				</h3>

				<p class="apartment-data">
					Rooms: {{ apartment.rooms }} • Beds: {{ apartment.beds }} • Bathrooms:
					{{ apartment.bathrooms }} • Footage: {{ apartment.square_meters }} mq
				</p>
			</div>
		</div>

		<div class="form-body">
			<div class="field mb-3">
				<label for="email" class="form-label">Your email here:</label>
				<input type="email" class="form-control" id="email" />
			</div>
			<div class="field mb-3">
				<label for="message" class="form-label">Your message here:</label>
				<textarea class="form-control" id="message" rows="5"></textarea>
			</div>
		</div>
		<div class="form-buttons">
			<router-link
				:to="{name: 'apartment', params: {id: apartment.id}}"
				class="button-general button-back">
				Back
			</router-link>

			<button type="button" class="button-general button-send">Send</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/variables" as *;

.container-fluid {
	max-width: 80vw;
	min-height: calc(100vh - 70px - 116px);
}

h1 {
	font-weight: 600;
	margin-top: 2rem;
}

.summary {
	padding: 2rem 0;
	display: flex;
	justify-content: space-between;

	.img-container {
		width: 25%;

		img {
			width: 100%;
			aspect-ratio: 3 / 2.5;
			object-fit: cover;
			object-position: center;
			border-radius: 20px;
			box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
				-5px 5px 5px rgba(120, 120, 120, 0.4);
		}
	}

	.info-container {
		width: 60%;
		font-weight: 300;
		color: $color-purple;

		h3,
		.data {
			margin-bottom: 1rem;
			line-height: 2.3rem;
			font-size: 1.3rem;
		}
		.data {
			font-weight: 600;
			color: $color-dark;
		}

		.apartment-data {
			font-size: 1.2rem;
			margin: 3rem 0 1rem 0;
			color: $color-dark;
		}
	}
}

.form-body {
	display: flex;
	width: 100%;
	margin-inline: auto;
	justify-content: space-between;

	.field {
		width: 45%;
	}
}

.form-buttons {
	display: flex;
	justify-content: space-evenly;
	margin-bottom: 2rem;
}

.button-general {
	border: none;
	border-radius: 10px;
	padding: 0.5rem 1.5rem;
	font-size: 1rem;
	font-weight: 600;
	text-decoration: none;
}

.button-back {
	background-color: $color-dark;
	color: $color-light;
}

.button-send {
	background-color: $color-blue;
	color: $color-light;
}

.modal {
	background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
	background-color: $color-light;
	color: $color-dark;
	border: 1px solid $color-purple;
	border-radius: 20px;

	.button-close {
		background-color: $color-dark;
		color: $color-light;
	}

	.button-send {
		background-color: $color-blue;
		color: $color-light;
	}
}
</style>
