<script>
import axios from "axios";
import { store } from "@/store/store.js";
export default {
  data() {
    return {
      store,
      radius: 1,
      arrApartment: [],
      arrServices: [],
      maxBeds: 0,
      maxRooms: 0,
    };
  },
  methods: {
    loadData() {
      axios.get(`${this.store.baseUrlApi}apartments/`).then((response) => {
        this.arrApartment = response.data;
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
  },
  created() {
    this.loadData();
  },
};
</script>

<template>
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
          <div
            class="d-flex flex-column gap-2 align-items-center justify-content-center"
          >
            <label for="search">Search Address:</label>
            <input type="text" name="search" />
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
                  <option v-for="(mr, i) in this.maxRooms" :value="i">
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
                  <option v-for="(mb, i) in this.maxBeds" :value="i">
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
              v-for="service in this.arrServices"
              class="container ms-check-label m-0 col-6"
              >{{ service.name }}
              <input type="checkbox" checked="checked" />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <button class="mySearch">Search</button>
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
