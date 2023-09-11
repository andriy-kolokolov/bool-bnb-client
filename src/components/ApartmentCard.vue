<script>
import {store} from "@/store/store.js";

export default {
	computed: {
		store() {
			return store;
		},
	},
	props: {
		apartment: Object,
		formatDistance: Function,
	},
};
</script>

<template>
	<div class="apartment_cards">
		<img
			class="cover_img"
			:src="store.backEndStorageURL + apartment.images[0].image_path"
			:alt="apartment.name" />
		<!-- isSponsor -->
		<span
			class="ms-sponsor-label"
			:class="{
				sponsor: apartment.is_sponsored === 1,
			}"
			v-if="apartment.is_sponsored === 1">
			<!-- {{ apartment.is_sponsored }} -->
			<i class="fa-solid fa-medal"></i
		></span>
		<!-- altre info -->
		<div class="more_info-up">
			<!-- stanze -->
			<span class="ms-label"
				><i class="fa-solid fa-door-open"></i>
				<span class="ms-deep-label">{{ apartment.rooms }}</span></span
			>

			<!-- bagni -->
			<span class="ms-label"
				><i class="fa-solid fa-bath"></i>
				<span class="ms-deep-label">{{ apartment.bathrooms }}</span></span
			>

			<!-- letti -->
			<span class="ms-label"
				><i class="fa-solid fa-bed"></i>
				<span class="ms-deep-label">{{ apartment.beds }}</span></span
			>
		</div>
		<div class="info">
			<div class="info_container">
				<h5>{{ apartment.name }}</h5>
				<h6>
					<i class="fa-solid fa-location-dot"></i>
					{{ apartment.address.city }}
				</h6>
				<p v-if="apartment.distance">
					{{ formatDistance(apartment.distance) }}
				</p>
			</div>
		</div>
		<div class="more_info">
			<!-- stanze -->
			<span class="ms-label"
				><i class="fa-solid fa-door-open"></i>
				<span class="ms-deep-label">{{ apartment.rooms }}</span></span
			>

			<!-- bagni -->
			<span class="ms-label"
				><i class="fa-solid fa-bath"></i>
				<span class="ms-deep-label">{{ apartment.bathrooms }}</span></span
			>

			<!-- letti -->
			<span class="ms-label"
				><i class="fa-solid fa-bed"></i>
				<span class="ms-deep-label">{{ apartment.beds }}</span></span
			>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/ms-variables" as *;

.apartment_cards {
	max-height: 20rem;
	max-width: 20rem;
	display: flex;
	align-content: center;
	justify-content: center;
	position: relative;

	&:hover img {
		transform: translateY(-20px);
		transition: 0.3s ease;
	}

	&:hover .ms-sponsor-label {
		transform: translateY(-20px);
		transition: 0.3s ease;
	}

	&:hover .more_info-up {
		transform: translateY(-20px);
		transition: 0.3s ease;
	}

	&:hover .info {
		bottom: -25px;
		height: 27%;
		padding-bottom: 0.6rem;
		transition: 0.3s ease;
	}

	&:hover .info h6 {
		opacity: 0;
		transition: 0.2s ease;
	}

	&:hover .info h5 {
		transform: translateY(1rem);
		transition: 0.3s ease;
	}

	&:hover .info p {
		transform: translateY(-0.7rem);
		transition: 0.3s ease;
	}

	&:hover .more_info {
		bottom: 30px;
		transition: 0.3s ease;
	}

	img {
		width: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 20px;
		object-fit: cover;
		transform: translateY(0px);
		z-index: -100;
		transition: 0.3s ease;
		box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.3),
			-5px 5px 5px rgba(120, 120, 120, 0.3);
	}

	.ms-sponsor-label {
		margin: 0;
		transition: 0.3s ease;
		text-align: center;
		color: $ms-color-light;
		position: absolute;
		top: 10px;
		left: 10px;
	}
	.sponsor {
		background-color: $ms-color-purple;
		padding: 2px 7px;
		border-radius: 10px;
		display: inline-block;
	}

	.info {
		position: absolute;
		bottom: -15px;
		transition: 0.3s ease;
		width: 78%;
		height: 30%;
		align-self: end;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 0;
		background-color: $ms-color-light;
		border-radius: 20px;
		box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
			-5px 5px 5px rgba(120, 120, 120, 0.4);

		.info_container {
			width: 90%;
			height: 95%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.35rem;

			h6,
			h5 {
				margin: 0;
				text-align: center;
				color: $ms-color-dark;
			}

			h5 {
				font-size: 15px;
				transition: 0.3s ease;
			}

			h6 {
				width: 102%;
				font-size: 13px;
				transition: 0.2s ease;
			}

			p {
				color: $ms-color-purple;
				font-weight: bold;
				font-size: 0.8rem;
				margin: 0;
				transition: 0.2s ease;

				&:hover .ms-distance {
					padding-bottom: 1rem;
					font-size: 1.3rem;
				}
			}
		}
	}

	.more_info {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 20%;
		align-self: end;
		display: flex;
		align-items: start;
		justify-content: center;
		gap: 0.3em;
		z-index: -50;
		transition: 0.3s ease;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;

		.ms-label {
			margin: 0;
			text-align: center;
			color: $ms-color-light;
			background-color: $ms-color-blue;
			padding: 4px 10px 6px 10px;
			border-radius: 10px;
			display: inline-block;
			padding: 4px 10px 6px 10px;
			border-radius: 10px;

			i {
				margin-right: 0.2em;
			}
		}

		.none {
			display: none;
		}
	}

	.more_info-up {
		display: none;
		position: absolute;
		top: 10px;
		right: 10px;
		width: 100%;
		height: 20%;
		align-self: end;
		// display: flex;
		align-items: start;
		justify-content: end;
		gap: 0.2em;
		z-index: -50;
		transition: 0.3s ease;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;

		.ms-label {
			margin: 0;
			text-align: center;
			color: $ms-color-light;
			background-color: $ms-color-blue;
			padding: 2px 6px 4px 6px;
			border-radius: 10px;
			display: inline-block;
			border-radius: 10px;

			i {
				margin-right: 0.2em;
			}
		}

		.none {
			display: none;
		}
	}
}

@media only screen and (max-width: 700px) {
	.apartment_cards {
		.more_info {
			display: none;
		}

		.more_info-up {
			display: flex;
		}
	}
}
</style>
