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
    getApartmentAvailability() {
      return this.apartment.is_available
          ? '<div><i class="fa-solid fa-calendar-check"></i></div> <div>Available</div>'
          : '<div><i class="fa-solid fa-calendar-xmark"></i></div>  <div>Not Available</div>';
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
  <Loading v-if="isLoading"/>
  <h2 class="text-center mt-4">Contact Apartment Owner</h2>
  <div class="container mt-5 mb-5 d-flex justify-content-center">
    <div
        v-if="apartment"
        class="row  justify-content-around align-items-center"
    >
      <div class="col-12 col-lg-5 align-items-center data__info-wrapper">
        <div class="p-4 info-wrapper__details-card row justify-content-center">
          <div class="ms-img-wrapper">
            <img
                class="ms-apartment-img"
                :src="store.backEndStorageURL + apartment.images[0].image_path"
                :alt="apartment.name"
            />
          </div>

          <div class="col-sm-12 details__other mt-4 p-3">
            <div class="other__card row g-2">
              <div class="col d-flex justify-content-center gap-1">
                <span>Rooms</span>
                <i class="fa-solid fa-door-open d-flex align-items-center"></i>
                <strong>{{ apartment.rooms }}</strong>
              </div>
              <div class="col d-flex justify-content-center gap-1">
                <span>Bathrooms</span>
                <i class="fa-solid fa-bath d-flex align-items-center"></i>
                <strong>{{ apartment.bathrooms }}</strong>
              </div>
              <div class="col d-flex justify-content-center gap-1">
                <span>Beds</span>
                <i class="fa-solid fa-bed d-flex align-items-center"></i>
                <strong>{{ apartment.beds }}</strong>
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
      <div class="col-12 col-lg-6">
        <form
            @submit.prevent="sendMessage"
            class="contact-wrapper row g-4 justify-content-between"
        >
          <div class="form-body col-12 justify-content-center">
            <div class="row mt-5 g-1 justify-content-center">
              <!--    ALERTS START    -->
              <div
                  class="col-lg-10 alert-container"
                  :class="{
            active: msg_sending || is_msg_send_successfully || is_msg_send_fail,
          }">
                <transition appear name="slide-fade" mode="out-in">
                  <div
                      v-if="msg_sending"
                      class="alert alert-primary alert-slide"
                      role="alert"
                  >
                    Sending message...
                  </div>
                </transition>
                <transition appear name="slide-fade" mode="out-in">
                  <div
                      v-if="is_msg_send_successfully"
                      class="alert alert-success alert-slide"
                      role="alert"
                  >
                    Message Sent Successfully
                  </div>
                </transition>
                <transition appear name="slide-fade" mode="out-in">
                  <div
                      v-if="is_msg_send_fail"
                      class="alert alert-danger alert-slide"
                      role="alert"
                  >
                    Message Sending Fail :(
                  </div>
                </transition>
              </div>
              <!--    ALERTS END    -->
              <div class="col-lg-10">
                <label for="guest_name" class="form-label">Your name here:</label>
                <input
                    type="text"
                    class="form-control"
                    id="guest_name"
                    v-model="guest_name"
                    placeholder="Enter your name"
                    minlength="3"
                />
              </div>
              <div class="col-lg-10">
                <label for="guest_email" class="form-label">Your email here:</label>
                <input
                    type="email"
                    class="form-control"
                    id="guest_email"
                    v-model="guest_email"
                    placeholder="Enter your email"
                />
              </div>
              <div class="col-lg-10">
                <label for="guest_message" class="form-label"
                >Your message here:</label
                >
                <textarea
                    class="form-control"
                    id="guest_message"
                    rows="5"
                    v-model="guest_message"
                    minlength="10"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="form-buttons col-12 mt-3 justify-content-between">
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
                  @click="showMsgAlert = true"
                  type="submit"
                  class="button-general button-send"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!--  <transition appear name="slide-fade">-->
  <!--    <div v-if="showMsgAlert" class="float-right">-->
  <!--      <div class="bg-blue-100 border-1-4 border-blue-500 text-grey-700 p-4" role="alert">-->
  <!--        <p class="font-bold">Informational message</p>-->
  <!--        <p>Your friend, recently shared a post.</p>-->
  <!--        <span>1 hour ago</span>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </transition>-->
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

    &:hover {
      scale: 1.02;
    }

    .ms-img-wrapper {
      .ms-apartment-img {
        max-width: 100%;
        aspect-ratio: 3 / 2;
        object-fit: cover;
        border-radius: $ms-border-radius-m;
        box-shadow: $ms-box-shadow-l;
      }
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

        & > div {
          cursor: default;
          transition: $ms-link-transition-m;

          &:hover {
            scale: $ms-scale-s;
            color: $ms-color-purple;
          }
        }

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
