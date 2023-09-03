<script>
import axios from "axios";
import { store } from "@/store/store.js";
export default {
  data() {
    return {
      store,
      arrApartment: [],
      arrServices: [],
      maxBeds: 0,
      maxRooms: 0,
      query: "",
      apiKey: "pIZDc5arEQSAalGkANUN2J8fiekVOefL",
      suggestions: [],
      street: "",
      zip: "",
      city: "",
      // dati per filtro
      latitude: 40.8359,
      longitude: 14.2488,
      radius: 100,
      selectBeds: 0,
      selectedRooms: 0,
      selectedServices: [],
    };
  },
  methods: {
    loadData() {
      axios.get(`${this.store.baseUrlApi}apartments/`).then((response) => {
        this.arrApartment = response.data;
        response.data.forEach((item) => {
          // Controllo l'appartamento con più stanze
          if (item.rooms) {
            if (item.rooms > this.maxRooms) {
              this.maxRooms = item.rooms + 1;
            }
          } else {
            console.log("no roomsss");
          }

          // Controllo l'appartamento con più letti
          if (item.beds) {
            if (item.beds > this.maxBeds) {
              this.maxBeds = item.beds + 1;
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

        setTimeout(() => {
          this.searchWithinRadius();
        }, 1000);
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

    getFilteredApartments(lat, lon, radius) {
      axios
        .get(store.baseUrlApi + "search", {
          params: {
            lat: this.latitude,
            lon: this.longitude,
            radius: this.radius,
            min_beds: 0,
            min_rooms: 0,
          },
        })
        .then((response) => {
          store.arrApartments = response.data.apartments;
          console.log(response.data.apartments);
          console.log(store.arrApartments);
        });
    },
  },
  created() {
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
  <button @click="getFilteredApartments">Search</button>
  <!-- search -->
  <button
    class="btn btn-primary mySearch"
    type="button"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasTop"
    aria-controls="offcanvasTop"
  >
    Search <i class="fa-solid fa-magnifying-glass"></i>
  </button>

  <div
    class="offcanvas offcanvas-top h-50"
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
        <div class="d-flex align-items-center justify-content-around">
          <!-- input -->
          <div class="input-container">
            <div class="search-box">
              <input
                type="text"
                v-model="query"
                @input="getSuggestions"
                @focus="clearInput"
              />
              <select v-if="suggestions.length > 0" ref="selectBox" size="5">
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
            <p>L'indirizzo inserito è: {{ street }}, {{ zip }} {{ city }}</p>
            <p>
              Le coordinate sono: Longitudine {{ longitude }}, Latitudine
              {{ latitude }}
            </p>
            <p>Il valore del raggio è: {{ radius }}</p>
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
                >
                  <option v-for="(mr, i) in this.maxRooms" :key="i" :value="i">
                    {{ i }}
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
                >
                  <option v-for="(mb, i) in this.maxBeds" :key="i" :value="i">
                    {{ i }}
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
                  min="1"
                  max="100"
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
              <input type="checkbox" />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <button class="mySearch" @click.prevent="getFilteredApartments">
            Search
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// search style

.mySearch {
  width: 150px;
  padding: 5px;
  border: 0px;
  border-radius: 20px;
  background-color: rgb(71, 92, 163);
  color: white;
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
}

// select
.mySelects {
  width: 100%;
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  .ms-select {
    width: fit-content;
    outline: none;
  }
}

.slidecontainer {
  width: 100%;
}
.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
    width: 20px;
    height: 20px;
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
  flex-basis: 35%;

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
</style>
