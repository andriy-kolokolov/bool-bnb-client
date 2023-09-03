<script>
import axios from "axios";
import {store} from "../store/store.js";

export default {
  data() {
    return {
      store,
      apartment: null,
    };
  },

  methods: {
    sendMessage() {
      let currentObj = this;
      console.log("EMAIL: ", this.email, " - MESSAGE: ", this.message);
      axios
          .post("http://localhost:8000/yourPostApi", {
            email: this.email,
            message: this.message,
          })

          .then(function (response) {
            currentObj.output = response.data;
          })

          .catch(function (error) {
            currentObj.output = error;
          });
    },
    getApartmentCoverImage(apartment) {
      return this.store.backEndStorageURL + apartment.images[0].image_path;
    },
    getApartmentAvailability() {
      return this.apartment.is_available
          ? '<div><i class="fa-solid fa-calendar-check"></i></div> <div>Available</div>'
          : 'Not Available';
    }
  },

  mounted() {
    const id = this.$route.params.id;
    axios.get(`${this.store.baseUrlApi}apartments/${id}`).then((response) => {
      this.apartment = response.data;
      console.log(this.apartment);
    });
  },
};
</script>

<template>
  <div v-if="apartment" class="container">
    <h2 class="text-center mt-3">Contact Apartment Owner</h2>
    <div class="apartment-wrapper__data mt-4 row g-4 justify-content-between">
      <div class="col-md-5 d-flex align-items-center">
        <div class="data__img-wrapper">
          <img
              class="img-wrapper__img"
              :src="getApartmentCoverImage(apartment)"
              alt="{{apartment.name}}"/>
        </div>
      </div>
      <div class="col-md-6 d-flex align-items-center data__info-wrapper ">
        <div class="info-wrapper__details-card row justify-content-center g-1 p-4">
          <div class="col-12 details__name fs-4 fw-medium">{{ apartment.name }}</div>
          <div class="col-12 details__location--address">
            <i class="fa-solid fa-location-dot"></i>
            {{ apartment.address.street + ', ' + apartment.address.city + ', ' + apartment.address.zip }}
          </div>
          <div class="col-12 details__owner"><strong> Owner:</strong>
            {{ apartment.user.name + ' ' + apartment.user.last_name }}
          </div>
          <div class="col-8 col-sm-12 details__other mt-4 p-3">
            <div class="other__card d-flex justify-content-center gap-1">
              <div class="">Rooms: <strong>{{ apartment.rooms }}</strong></div>
              <div class="">Bathrooms: <strong>{{ apartment.bathrooms }}</strong></div>
              <div class="">Beds: <strong>{{ apartment.beds }}</strong></div>
              <div class="">Square Meters: <strong>{{ apartment.square_meters }}</strong></div>
            </div>
            <div class="other__status mt-3 d-flex justify-content-center">
              <div v-html="getApartmentAvailability()"
                   class="status__element"
                   :class="{ available: apartment.is_available === 1, not_available: apartment.is_available === 0}">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-wrapper mt-4 row g-4 justify-content-between">
      <form class="col-sm-12" @submit.prevent="sendMessage">
        <div class="form-body row">
          <div class="col-md-6 field">
            <label for="email" class="form-label">Your email here:</label>
            <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"/>
          </div>
          <div class="col-md-6 field">
            <label for="message" class="form-label">Your message here:</label>
            <textarea
                class="form-control"
                id="message"
                rows="5"
                v-model="message"></textarea>
          </div>
        </div>
        <div class="form-buttons">
          <router-link
              :to="{name: 'apartment', params: {id: apartment.id}}"
              class="button-general button-back">
            Back
          </router-link>

          <button
              @click="sendMessage"
              type="submit"
              class="button-general button-send"
              data-bs-toggle="modal"
              data-bs-target="#successSend">
            Send
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal -->
  <div
      class="modal fade"
      id="successSend"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
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
              class="button-general button-send"
              data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/ms-variables" as *;

h1 {
  font-weight: 600;
}

.apartment-wrapper__data {

  .data__img-wrapper {

    img {
      width: 100%;
      aspect-ratio: 3 / 2.5;
      object-fit: cover;
      object-position: center;
      border-radius: $ms-border-radius-m;
      box-shadow: $ms-box-shadow-l;
    }
  }

  .data__info-wrapper {

    .info-wrapper__details-card {
      box-shadow: $ms-box-shadow-l;
      border-radius: $ms-border-radius-m;

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
