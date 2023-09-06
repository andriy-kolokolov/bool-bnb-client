<script>
import axios from "axios";
import {store} from "../store/store.js";
import Loading from "../components/Loading.vue";
import auth from "@/store/auth.js";

export default {
	components: {
		Loading,
	},
	data() {
		return {
			store,
			guest_name: "",
			guest_email: "",
			guest_message: "",
			isLoading: true,
			visitor: this.getVisitor,
			apartment: null,
			msg_sending: false,
			is_msg_send_successfully: false,
			is_msg_send_fail: false,
			showMsgAlert: false,
		};
	},
	methods: {
		getVisitor() {
			if (auth.user === null) {
				this.visitor = "guest";
			} else {
				this.visitor = auth.user;
				this.guest_name = auth.user.name + " " + auth.user.last_name;
				this.guest_email = auth.user.email;
			}
		},
		refreshSendingStatus() {
			setTimeout(() => {
				this.msg_sending = false;
				this.is_msg_send_successfully = false;
				this.is_msg_send_fail = false;
			}, 2000);
		},
		sendMessage() {
			this.msg_sending = true;
			axios
				.post(store.baseUrlApi + "send-message", {
					apartment_id: this.apartment.id,
					guest_name: this.guest_name,
					guest_email: this.guest_email,
					message: this.guest_message,
				})
				.then((response) => {
					setTimeout(() => {
						this.msg_sending = false;
					}, 500);
					if (response.data.status === true) {
						setTimeout(() => {
							this.is_msg_send_successfully = true;
						}, 1200);
					}
				})
				.catch((error) => {
					this.msg_sending = false;
					this.is_msg_send_successfully = false;
					setTimeout(() => {
						this.is_msg_send_fail = true;
					}, 600);
					console.error(error.response.data.message);
				})
				.finally(this.refreshSendingStatus);
		},
		getApartmentCoverImage(apartment) {
			return this.store.backEndStorageURL + apartment.images[0].image_path;
		},
	},
	created() {
		this.getVisitor();
	},
	mounted() {
		const id = this.$route.params.id;
		axios.get(`${this.store.baseUrlApi}apartments/${id}`).then((response) => {
			this.apartment = response.data;
			console.log(this.apartment);
			this.isLoading = false;
		});
	},
};
</script>

<template>
	<Loading v-if="isLoading" />
	<div class="ms-container">
		<h2 class="text-center">Contact Apartment Owner</h2>
		<div class="container mt-sm-5 mb-5 d-flex justify-content-center">
			<div
				v-if="apartment"
				class="row g-2 align-items-center justify-content-center">
				<div class="col-12 col-lg-5 align-items-center data__info-wrapper">
					<div
						class="p-4 info-wrapper__details-card row justify-content-center">
						<div class="px-0 ms-img-wrapper">
							<img
								class="ms-apartment-img"
								:src="store.backEndStorageURL + apartment.images[0].image_path"
								:alt="apartment.name" />
						</div>

						<div class="col-sm-12 details__other mt-4 p-3">
							<div class="other__card row g-2">
								<div class="col d-flex justify-content-center gap-1">
									<span class="d-flex align-items-center">Rooms</span>
									<div class="d-flex gap-1 ms-badge">
										<i
											class="fa-solid fa-door-open d-flex align-items-center"></i>
										<strong>{{ apartment.rooms }}</strong>
									</div>
								</div>
								<div class="col d-flex justify-content-center gap-1">
									<span class="d-flex align-items-center">Bathrooms</span>
									<div class="d-flex gap-1 ms-badge">
										<i class="fa-solid fa-bath d-flex align-items-center"></i>
										<strong>{{ apartment.bathrooms }}</strong>
									</div>
								</div>
								<div class="col d-flex justify-content-center gap-1">
									<span class="d-flex align-items-center">Beds</span>
									<div class="d-flex gap-1 ms-badge">
										<i class="fa-solid fa-bed d-flex align-items-center"></i>
										<strong>{{ apartment.beds }}</strong>
									</div>
								</div>
							</div>
							<div class="other__status mt-3 row justify-content-around">
								<div
									class="col-8 col-sm-8 col-md-10 gap-1 status__address d-flex justify-content-center align-items-center">
									<i class="fa-solid fa-map-location-dot ms-icon"></i>
									<div>
										{{
											apartment.address.street +
											", " +
											apartment.address.city +
											", " +
											apartment.address.zip
										}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-lg-6">
					<form
						@submit.prevent="sendMessage"
						class="contact-wrapper row g-4 justify-content-between">
						<div class="form-body col-12 justify-content-center">
							<div class="row g-1 justify-content-center">
								<!--    ALERTS START    -->
								<div
									class="col-lg-10 alert-container"
									:class="{
										active:
											msg_sending ||
											is_msg_send_successfully ||
											is_msg_send_fail,
									}">
									<transition appear name="slide-fade" mode="out-in">
										<div
											v-if="msg_sending"
											class="alert alert-primary alert-slide"
											role="alert">
											Sending message...
										</div>
									</transition>
									<transition appear name="slide-fade" mode="out-in">
										<div
											v-if="is_msg_send_successfully"
											class="alert alert-success alert-slide"
											role="alert">
											Message Sent Successfully!
										</div>
									</transition>
									<transition appear name="slide-fade" mode="out-in">
										<div
											v-if="is_msg_send_fail"
											class="alert alert-danger alert-slide"
											role="alert">
											Message Sending Fail :(
										</div>
									</transition>
								</div>
								<!--    ALERTS END    -->
								<div class="col-lg-10">
									<label for="guest_name" class="form-label"
										>Your name here:</label
									>
									<input
										type="text"
										class="form-control"
										id="guest_name"
										v-model="guest_name"
										placeholder="Enter your name"
										minlength="3" />
								</div>
								<div class="col-lg-10">
									<label for="guest_email" class="form-label"
										>Your email here:</label
									>
									<input
										type="email"
										class="form-control"
										id="guest_email"
										v-model="guest_email"
										placeholder="Enter your email" />
								</div>
								<div class="col-lg-10">
									<label for="guest_message" class="form-label"
										>Your message here:</label
									>
									<textarea
										class="form-control"
										id="guest_message"
										rows="3"
										v-model="guest_message"
										minlength="10"></textarea>
								</div>
							</div>
						</div>
						<div class="form-buttons col-12 mt-3 justify-content-between">
							<div class="col d-flex justify-content-center">
								<router-link
									:to="{name: 'apartment', params: {id: apartment.id}}"
									class="button-general button-back">
									Back
								</router-link>
							</div>

							<div class="col d-flex justify-content-center">
								<button
									@click="showMsgAlert = true"
									type="submit"
									class="button-general button-send">
									Send
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/ms-variables" as *;

.ms-container {
	width: 100%;
	min-height: calc(100vh - 120px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

// VUE TRANSITION
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.slide-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}

.alert-container {
	max-height: 0;
	transition: max-height $ms-link-transition-l ease-out;
	overflow: hidden;

	&.active {
		max-height: 500px;
		transition: max-height $ms-link-transition-l ease-in;
	}
}

.data__info-wrapper {
	.info-wrapper__details-card {
		box-shadow: $ms-box-shadow-l;
		border-radius: $ms-border-radius-m;
		transition: $ms-link-transition-s;

		@media only screen and (max-width: 576px) {
			box-shadow: none;
			border-radius: 0;
		}

		&:hover {
			scale: 1.02;
		}
	}

	.ms-img-wrapper {
		.ms-apartment-img {
			width: 100%;
			aspect-ratio: 3 / 2;
			object-fit: cover;
			border-radius: $ms-border-radius-m;
			box-shadow: $ms-box-shadow-l;
		}
	}

	.details__other {
		color: $ms-color-dark;
		box-shadow: $ms-box-shadow-l;
		border-radius: $ms-border-radius-m;

		@media only screen and (max-width: 576px) {
			box-shadow: none;
			border-radius: 0;
		}

		.other__card {
			font-size: 13px;

			& > div {
				cursor: default;
				transition: $ms-link-transition-m;

				& > .ms-badge {
					color: white;
					background-color: $ms-color-purple;
					padding: 2px 5px;
					border-radius: 5px;
				}
			}
		}

		.other__status {
			.status__address {
				font-size: 15px;
				padding: 4px 10px 6px 10px;
				border-radius: 10px;
				display: inline-block;
			}

			.ms-icon {
				color: $ms-color-purple;
			}
		}

		.status__element {
			display: flex !important;
			justify-content: center !important;
			align-items: center !important;
			gap: 10px;
		}
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
	background-color: $ms-color-dark;
	color: $ms-color-light;
}

.button-send {
	background-color: $ms-color-blue;
	color: $ms-color-light;
}

.modal {
	background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
	background-color: $ms-color-light;
	color: $ms-color-dark;
	border: 1px solid $ms-color-purple;
	border-radius: 20px;

	.button-close {
		background-color: $ms-color-dark;
		color: $ms-color-light;
	}

	.button-send {
		background-color: $ms-color-blue;
		color: $ms-color-light;
	}
}
</style>
