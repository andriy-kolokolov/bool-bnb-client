<script>
import axios from "axios";
import { store } from "../store/store.js";
import { TransitionGroup } from "vue";
import Loading from "../components/Loading.vue";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      store,
      isLoading: true,
      visitor: null, // return is_authenticated_user ? user : null;
      apartment: null,
      msg_sending: false,
      is_msg_send_successfully: false,
      is_msg_send_fail: false,
    };
  },

  methods: {
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
          guest_name: "if authenticated username", // todo
          guest_email: this.email,
          message: this.message,
        })
        .then((response) => {
          if (response.data.status === true) {
            this.is_msg_send_successfully = true;
          } else {
            this.is_msg_send_fail = true;
          }
          this.msg_sending = false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(this.refreshSendingStatus);
    },
    getApartmentCoverImage(apartment) {
      return this.store.backEndStorageURL + apartment.images[0].image_path;
    },
    getApartmentAvailability() {
      return this.apartment.is_available
        ? '<div><i class="fa-solid fa-calendar-check"></i></div> <div>Available</div>'
        : '<div><i class="fa-solid fa-calendar-xmark"></i></div>  <div>Not Available</div>';
    },
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
  <Loading v-if="this.isLoading" />
  <div
    v-if="apartment"
    class="container ms-height d-flex flex-column align-items-center justify-content-center"
  >
    <h2 class="text-center">Contact Apartment Owner</h2>
    <div class="apartment-wrapper__data mt-4 row g-4 justify-content-between">
      <div class="col-md-5 d-flex align-items-center">
        <div class="data__img-wrapper">
          <img
            class="img-wrapper__img"
            :src="getApartmentCoverImage(apartment)"
            alt="{{apartment.name}}"
          />
        </div>
      </div>
      <div class="col-md-6 d-flex align-items-center data__info-wrapper">
        <div
          class="info-wrapper__details-card row justify-content-center g-1 p-4"
        >
          <div class="col-12 details__name fs-4 fw-medium">
            {{ apartment.name }}
          </div>
          <div class="col-12 details__location--address">
            <i class="fa-solid fa-location-dot"></i>
            {{
              apartment.address.street +
              ", " +
              apartment.address.city +
              ", " +
              apartment.address.zip
            }}
          </div>
          <div class="col-12 details__owner">
            <strong> Owner:</strong>
            {{ apartment.user.name + " " + apartment.user.last_name }}
          </div>
          <div class="col-8 col-sm-12 details__other mt-4 p-3">
            <div class="other__card d-flex justify-content-center gap-1">
              <div class="">
                Rooms: <strong>{{ apartment.rooms }}</strong>
              </div>
              <div class="">
                Bathrooms: <strong>{{ apartment.bathrooms }}</strong>
              </div>
              <div class="">
                Beds: <strong>{{ apartment.beds }}</strong>
              </div>
              <div class="">
                Square Meters: <strong>{{ apartment.square_meters }}</strong>
              </div>
            </div>
            <div class="other__status mt-3 d-flex justify-content-center">
              <div
                v-html="getApartmentAvailability()"
                class="status__element"
                :class="{
                  available: apartment.is_available === 1,
                  not_available: apartment.is_available === 0,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-wrapper mt-4 row g-4 justify-content-between w-100">
      <form class="col-sm-12" @submit.prevent="sendMessage">
        <div class="form-body row">
          <div class="col-md-12 field w-75 mx-auto">
            <label for="email" class="form-label">Your email here:</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
            />
          </div>
          <div class="col-md-12 field w-75 mx-auto mt-3">
            <Transition-Group name="fade">
              <div
                v-if="msg_sending"
                class="alert alert-primary"
                role="alert"
                key="msg_sending"
              >
                Sending message...
              </div>
              <div
                v-if="is_msg_send_successfully"
                class="alert alert-success"
                role="alert"
                key="is_msg_send_successfully"
              >
                Message Sent Successfully
              </div>
              <div
                v-if="is_msg_send_fail"
                class="alert alert-danger"
                role="alert"
                key="is_msg_send_fail"
              >
                Message Sending Fail :(
              </div>
            </Transition-Group>
            <label for="message" class="form-label">Your message here:</label>
            <textarea
              class="form-control"
              id="message"
              rows="5"
              v-model="message"
            ></textarea>
          </div>
        </div>
        <div class="form-buttons mt-4 row g-4 justify-content-between">
          <div class="col d-flex justify-content-center">
            <router-link
              :to="{ name: 'apartment', params: { id: apartment.id } }"
              class="button-general button-back"
            >
              Back
            </router-link>
          </div>

          <div class="col d-flex justify-content-center">
            <button
              type="submit"
              class="button-general button-send"
              data-bs-toggle="modal"
              data-bs-target="#successSend"
            >
              Send
            </button>
          </div>
        </div>
      </form>
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

.ms-height {
  min-height: calc(100vh - 120px);
}

h1 {
  font-weight: 600;
}

.apartment-wrapper__data {
  .data__img-wrapper {
    img {
      transition: $ms-link-transition-s;
      width: 100%;
      aspect-ratio: 3 / 2.5;
      object-fit: cover;
      object-position: center;
      border-radius: $ms-border-radius-m;
      box-shadow: $ms-box-shadow-l;

      &:hover {
        scale: 1.02;
      }
    }
  }

  .data__info-wrapper {
    .info-wrapper__details-card {
      box-shadow: $ms-box-shadow-l;
      border-radius: $ms-border-radius-m;
      transition: $ms-link-transition-s;

      &:hover {
        scale: 1.02;
      }

      .details__location--address {
        transition: $ms-link-transition-s;
        cursor: default;

        &:hover {
          color: $ms-color-purple;
        }
      }

      .details__other {
        color: $ms-color-dark;
        box-shadow: $ms-box-shadow-l;
        border-radius: $ms-border-radius-m;

        .other__card {
          font-size: 13px;
        }

        .status__element {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 10px;
        }

        .available {
          color: $ms-color-light;
          background-color: rgb(1, 125, 1);
          padding: 4px 10px 6px 10px;
          border-radius: 10px;
          display: inline-block;
        }

        .not_available {
          color: $ms-color-light;
          background-color: rgb(145, 0, 0);
          padding: 4px 10px 6px 10px;
          border-radius: 10px;
          display: inline-block;
        }
      }
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
