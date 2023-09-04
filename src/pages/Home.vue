<script>
import axios from "axios";
import { store } from "../store/store.js";
import Loading from "../components/Loading.vue";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      store,
      gettingApartments: false,
      isLoading: false,
      arrApartments: [],
      arrServices: [],
      maxBeds: 0,
      maxRooms: 0,
      query: "",
      apiKey: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
      suggestions: [],
      street: "",
      zip: "",
      city: "",
      // dati per filtri
      longitude: "",
      latitude: "",
      radius: 20,
      selectedRooms: 1,
      selectedBeds: 1,
      selectedServices: [],
    };
  },
  methods: {
    loadData() {
      axios.get(`${this.store.baseUrlApi}apartments/`).then((response) => {
        this.arrApartments = response.data;
        console.log("Search");
        // console.log(this.arrApartment);

        response.data.forEach((item) => {
          // Controllo l'appartamento con più stanze
          if (item.rooms) {
            if (item.rooms > this.maxRooms) {
              this.maxRooms = item.rooms;
            }
          } else {
            console.log("no roomsss");
          }

          // Controllo l'appartamento con più letti
          if (item.beds) {
            if (item.beds > this.maxBeds) {
              this.maxBeds = item.beds;
            }
          } else {
            console.log("no bedsss");
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
        this.latitude = response.data.results[0].position.lat;
        this.longitude = response.data.results[0].position.lon;
        console.log(
          "Longitude: ",
          this.longitude,
          " - Latitude: ",
          this.latitude,
        );

        // 	setTimeout(() => {
        // 		this.getFilteredApartments();
        // 	}, 1000);
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

    getApartments() {
      this.isLoading = true;
      axios.get(this.store.baseUrlApi + "apartments").then((response) => {
        this.arrApartments = response.data;
        this.gettingApartments = true;
        this.isLoading = false;
      });
    },

    getFilteredApartments() {
      this.gettingApartments = false;
      this.isLoading = true;
      this.arrApartments = [];
      const selectedServiceNames = this.selectedServices
        .map((id) => {
          const service = this.arrServices.find((service) => service.id === id);
          return service ? service.name : null;
        })
        .filter((name) => name !== null);
      console.log({
        lat: this.latitude,
        lon: this.longitude,
        radius: this.radius,
        min_beds: this.minBeds,
        min_rooms: this.minRooms,
        required_services: selectedServiceNames,
      });
      axios
        .get(store.baseUrlApi + "search", {
          params: {
            lat: parseFloat(this.latitude),
            lon: parseFloat(this.longitude),
            radius: this.radius,
            min_beds: this.selectedBeds,
            min_rooms: this.selectedRooms,
            required_services: selectedServiceNames,
          },
        })
        .then((response) => {
          this.arrApartments = response.data.apartments;
          console.log(this.arrApartments);
          this.gettingApartments = true;
          this.isLoading = false;
        });
    },

    getApartmentCoverImage(apartment) {
      return this.store.backEndStorageURL + apartment.images[0].image_path;
    },
  },
  created() {
    this.getApartments();
    this.loadData();
  },
  watch: {
    radius(newRadius) {
      this.radius = newRadius;
    },
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
    data-bs-target="#offcanvasTop"
    aria-controls="offcanvasTop"
  >
    Search <i class="fa-solid fa-magnifying-glass"></i>
  </button>

  <div
    class="offcanvas offcanvas-top ms-height"
    tabindex="-1"
    id="offcanvasTop"
    aria-labelledby="offcanvasTopLabel"
  >
    <div
      class="offcanvas-header d-flex gap-3 align-items-center justify-content-center"
    >
      <h5 class="offcanvas-title" id="offcanvasTopLabel">Search</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div
      class="offcanvas-body d-flex align-items-center justify-content-center"
    >
      <form class="w-100">
        <div class="d-flex align-items-center justify-content-evenly">
          <!-- input -->
          <div class="input-container">
            <div class="search-box">
              <input
                type="text"
                class="ms-input"
                v-model="query"
                @input="getSuggestions"
                @focus="clearInput"
              />
              <select
                v-if="suggestions.length > 0"
                ref="selectBox"
                size="5"
                class="ms-select-address"
              >
                <option
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  :value="suggestion"
                  :selected="index === highlighted"
                  @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </option>
              </select>
            </div>
          </div>

          <!-- selects -->
          <div
            class="d-flex flex-column gap-2 align-items-center justify-content-center"
          >
            <div class="mySelects">
              <div
                class="d-flex flex-column align-items-center justify-content-center"
              >
                <label for="rooms">N. Room</label>
                <select
                  class="form-select form-select-sm ms-select"
                  name="rooms"
                  v-model="selectedRooms"
                >
                  <option
                    v-for="(mr, i) in this.maxRooms"
                    :key="i"
                    :value="i + 1"
                  >
                    {{ i + 1 }}
                  </option>
                </select>
              </div>
              <div
                class="d-flex flex-column align-items-center justify-content-center"
              >
                <label for="beds">N. Bed</label>
                <select
                  class="form-select form-select-sm ms-select"
                  name="beds"
                  v-model="selectedBeds"
                >
                  <option
                    v-for="(mb, i) in this.maxBeds"
                    :key="i"
                    :value="i + 1"
                  >
                    {{ i + 1 }}
                  </option>
                </select>
              </div>
            </div>

            <!-- slider -->
            <div class="slidecontainer">
              <label for="myRange">Kilometers</label>
              <div class="slider-container">
                <input
                  type="range"
                  name="km"
                  min="20"
                  max="500"
                  class="slider"
                  id="myRange"
                  v-model="radius"
                />
                <div class="slider-value">{{ radius }} km</div>
              </div>
            </div>
          </div>

          <!-- checkbox -->

          <div class="check-container row">
            <label
              v-for="(service, index) in this.arrServices"
              :key="index"
              class="container ms-check-label m-0 col-6"
              >{{ service.name }}
              <input
                type="checkbox"
                v-model="selectedServices"
                :value="service.id"
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
        <div
          class="mt-5 d-flex gap-3 align-items-center justify-content-center"
        >
          <button
            class="back-btn"
            data-bs-dismiss="offcanvas"
            @click.prevent="getApartments"
          >
            Reset
          </button>
          <button
            class="inputSearch"
            data-bs-dismiss="offcanvas"
            @click.prevent="getFilteredApartments"
          >
            Search <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!--************************* APARTMENTS CARDS ************************* -->
  <div class="style" v-if="gettingApartments">
    <router-link
      :to="`/apartment/${apartment.id}`"
      v-for="apartment in arrApartments"
      :key="apartment.id"
      class="routerstyle"
    >
      <div class="apartment_cards">
        <img
          class="cover_img"
          :src="getApartmentCoverImage(apartment)"
          :alt="apartment.name"
        />
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
          <!-- {{ apartment.is_available }} -->
          <span
            class="ms-label"
            :class="{
              available: apartment.is_available === 1,
              none: apartment.is_available === 0,
            }"
            ><i class="fa-solid fa-calendar-check"></i>
            <span class="ms-deep-label">Available</span></span
          >
          <span
            class="ms-label"
            :class="{
              not_available: apartment.is_available === 0,
              none: apartment.is_available === 1,
            }"
            ><i class="fa-solid fa-calendar-xmark"></i>
            <span class="ms-deep-label">Not Available</span></span
          >
          <span
            class="ms-sponsor-label"
            :class="{
              sponsor: apartment.is_sponsored === 1,
              none: apartment.is_sponsored === 0,
            }"
          >
            <!-- {{ apartment.is_sponsored }} -->
            <i class="fa-solid fa-medal"></i
          ></span>
        </div>
      </div>
    </router-link>
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
  background-color: rgb(71, 92, 163);
  color: white;
}

.inputSearch {
  width: 130px;
  padding: 5px;
  border: 0px;
  border-radius: 20px;
  background-color: rgb(71, 92, 163);
  color: white;
}

.back-btn {
  width: 150px;
  padding: 5px;
  border: 0px;
  border-radius: 20px;
  background-color: #1e1e1e;
  color: white;
}

.ms-height {
  height: 380px;
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
    border: 2px solid rgb(71, 92, 163);
    border-radius: 5px;
    padding: 5px 15px 5px 15px;
    font-size: 1.3em;
  }

  .ms-select-address {
    width: 300px;
    border: 2px solid rgb(71, 92, 163);
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
  -webkit-appearance: none;
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
    background: rgb(71, 92, 163);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: rgb(71, 92, 163);
    cursor: pointer;
  }
}

.check-container {
  width: 25%;

  .ms-check-label {
    font-size: 20px;
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
    background-color: rgb(71, 92, 163);
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
.style {
  min-height: calc(100vh - 120px);
  width: 90vw;
  display: flex;
  flex-wrap: wrap;
  gap: 6em;
  align-content: center;
  justify-content: center;
  margin-inline: auto;
  padding-top: 3em;
  padding-bottom: 3em;
  .routerstyle {
    text-decoration: none;
    width: calc((100% - 6em) / 5);
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    .apartment_cards {
      max-height: 24rem;
      max-width: 24rem;
      display: flex;
      align-content: center;
      justify-content: center;
      position: relative;

      &:hover img {
        transform: translateY(-20px);
        transition: 0.3s ease;
      }

      &:hover .info {
        bottom: -35px;
        height: 12vh;
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
        bottom: 40px;
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

      .info {
        position: absolute;
        bottom: -15px;
        transition: 0.3s ease;
        width: 65%;
        height: 14vh;
        align-self: end;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 0;
        background-color: rgb(250, 250, 250);
        border-radius: 20px;
        box-shadow: 5px 5px 5px rgba(120, 120, 120, 0.4),
          -5px 5px 5px rgba(120, 120, 120, 0.4);

        .info_container {
          width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;

          h6,
          h5 {
            margin: 0;
            text-align: center;
            color: rgb(0, 0, 0);
          }

          h5 {
            transition: 0.3s ease;
            font-size: clamp(0.5em, 1.2em, 3em);
          }

          h6 {
            transition: 0.2s ease;
          }

          p {
            color: #9153a9;
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
        height: 10vh;
        align-self: end;
        display: flex;
        align-items: start;
        justify-content: center;
        gap: 1em;
        z-index: -50;
        transition: 0.3s ease;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;

        .ms-label {
          margin: 0;
          text-align: center;
          color: rgb(255, 255, 255);

          i {
            margin-right: 0.5em;
          }
        }

        .available {
          background-color: rgb(1, 125, 1);
          padding: 4px 10px 6px 10px;
          border-radius: 10px;
          display: inline-block;
        }

        .not_available {
          background-color: rgb(145, 0, 0);
          padding: 4px 10px 6px 10px;
          border-radius: 10px;
          display: inline-block;
        }

        .ms-sponsor-label {
          margin: 0;
          text-align: center;
          color: rgb(255, 255, 255);
        }
        .sponsor {
          background-color: rgb(120, 0, 160);
          padding: 5px 10px 5px 10px;
          border-radius: 10px;
          display: inline-block;
        }

        .none {
          display: none;
        }
      }
    }
  }
}

@media only screen and (max-width: 1750px) {
  .style {
    gap: 4em;
    .routerstyle {
      width: calc((100% - 4em) / 4);
    }
  }
}

@media only screen and (max-width: 1500px) {
  .style {
    .routerstyle {
      .apartment_cards {
        &:hover .info {
          height: 9vh;
        }

        &:hover .more_info {
          bottom: 25px;
        }

        .info {
          height: 10vh;

          .info_container {
            h5 {
              font-size: clamp(0.5em, 1.1em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 0.9em, 3em);
            }
          }
        }
        // fine info
        .more_info {
          height: 8vh;
        }
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 1300px) {
  .style {
    .routerstyle {
      .apartment_cards {
        &:hover .info {
          height: 8vh;
        }
        .info {
          height: 9.5vh;
          .info_container {
            h5 {
              font-size: clamp(0.5em, 1em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 0.85em, 3em);
            }
          }
        }
        // fine info
        .more_info {
          height: 7vh;
        }
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 1250px) {
  .style {
    .routerstyle {
      .apartment_cards {
        .more_info {
          gap: 0.5em;

          .ms-label {
            margin: 0;
            text-align: center;
            color: rgb(255, 255, 255);

            i {
              margin-right: 0;
            }

            .ms-deep-label {
              display: none;
            }
          }
        }
        // fine more info
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 1050px) {
  .style {
    width: 90%;
    margin-inline: auto;
    gap: 5em;
    .routerstyle {
      width: calc((100% - 5em) / 2);
      .apartment_cards {
        &:hover .info {
          height: 115px;
        }

        &:hover .more_info {
          bottom: 30px;
        }

        .info {
          height: 150px;

          .info_container {
            h5 {
              font-size: clamp(0.5em, 1.2em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 1em, 3em);
            }
          }
        }
        // fine info
        .more_info {
          height: 95px;
          gap: 1em;

          .ms-label {
            margin: 0;
            text-align: center;
            color: rgb(255, 255, 255);

            i {
              margin-right: 0.5em;
            }

            .ms-deep-label {
              display: inline-block;
            }
          }
        }
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 850px) {
  .style {
    .routerstyle {
      .apartment_cards {
        &:hover .info {
          height: 100px;
        }

        &:hover .more_info {
          bottom: 25px;
        }

        .info {
          height: 130px;

          .info_container {
            h5 {
              font-size: clamp(0.5em, 1.1em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 0.9em, 3em);
            }
          }
        }
        // fine info
        .more_info {
          height: 85px;
          gap: 1em;
        }
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 730px) {
  .style {
    gap: 5em;
    .routerstyle {
      width: calc((100% - 5em) / 1);
      .apartment_cards {
        &:hover .info {
          height: 110px;
        }

        &:hover .more_info {
          bottom: 25px;
        }

        .info {
          height: 130px;

          .info_container {
            h5 {
              font-size: clamp(0.5em, 1.4em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 1.1em, 3em);
            }
          }
        }
        // fine info
        .more_info {
          height: 100px;
          gap: 1em;

          .ms-label {
            margin: 0;
            text-align: center;
            color: rgb(255, 255, 255);

            i {
              margin-right: 0.5em;
            }

            .ms-deep-label {
              display: inline-block;
            }
          }
        }
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 730px) {
  .style {
    .routerstyle {
      .apartment_cards {
        .info {
          .info_container {
            h5 {
              font-size: clamp(0.5em, 1.2em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 0.9em, 3em);
            }
          }
        }
        // fine info
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 450px) {
  .style {
    width: 97%;
    margin-inline: auto;
    .routerstyle {
      .apartment_cards {
        &:hover .info {
          height: 100px;
        }
        .info {
          height: 130px;
          .info_container {
            h5 {
              font-size: clamp(0.5em, 1.1em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 0.85em, 3em);
            }
          }
        }
        // fine info

        .more_info {
          height: 100px;
        }
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}

@media only screen and (max-width: 400px) {
  .style {
    .routerstyle {
      .apartment_cards {
        &:hover .info {
          height: 85px;
        }
        &:hover .more_info {
          bottom: 15px;
          transition: 0.3s ease;
        }
        .info {
          height: 110px;
          .info_container {
            h5 {
              font-size: clamp(0.5em, 0.95em, 3em);
            }

            h6 {
              font-size: clamp(0.5em, 0.8em, 3em);
            }
          }
        }
        // fine info

        .more_info {
          height: 80px;
        }
      }
      // fine apartment cards
    }
    // fine routerstyle
  }
  // fine style
}
</style>
