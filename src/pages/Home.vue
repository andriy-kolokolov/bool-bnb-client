<script>
import axios from "axios";
import { store } from "../store/store.js";
import { ref } from "vue";
export default {
  data() {
    return {
      store,
      arrApartments: [],
      showImg: ref(-1),
    };
  },
  methods: {
    getApartments() {
      axios.get(this.store.baseUrlApi + "apartments").then((response) => {
        this.arrApartments = response.data;
      });
      console.log(this.arrApartments);
    },
  },
  created() {
    this.getApartments();
  },
};
</script>

<template>
  <div class="style">
    <router-link
      :to="`/apartment/${apartment.id}`"
      v-for="(apartment, index) in arrApartments"
      :key="apartment.id"
      class="routerstyle"
      @mouseover="showImg = index"
      @mouseout="showImg = ''"
    >
      <div class="apartment_cards">
        <img
          class="cover_img"
          :src="apartment.images[0].image_path"
          :alt="apartment.name"
        />
        <!-- SECONDA IMMAGINE
          <img
          v-if="index === showImg"
          :src="apartment.images[1].image_path"
          :alt="apartment.name"
        /> -->
        <div class="info">
          <div class="info_container">
            <h5>{{ apartment.name }}</h5>
            <h6>
              <i class="fa-solid fa-location-dot"></i>
              {{ apartment.address.city }}
            </h6>
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
@use "../assets/partials/variables" as *;
.style {
  width: fit-content;
  display: flex;
  flex-wrap: wrap;
  gap: 6em;
  align-content: center;
  justify-content: center;
  margin-top: 6em;
  margin-bottom: 3em;
  .routerstyle {
    text-decoration: none;
    width: calc((100% - 6em) / 5);
    user-select: none;
    .apartment_cards {
      height: fit-content;
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
              margin-right: 0em;
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
