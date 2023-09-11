<script>
import { store } from "@/store/store.js";
export default {
  data() {
    return {
      store,
    };
  },
  methods: {
    btnMenu() {
      const button = document.getElementById("button");
      const btn = document.getElementById("btn");
      button.classList.toggle("toggled");
      btn.classList.toggle("toggled");
    },

    resetFilters() {
      console.log("RESET CLICKED");
      this.resetVariables();
      this.$router.push("/").then(() => {
        this.$router.go(0);
      });
    },
    resetVariables() {
      store.longitude = "";
      store.latitude = "";
      store.radius = 20;
      store.selectedRooms = 1;
      store.selectedBeds = 1;
      store.selectedServices = [];
    },
  },
};
</script>

<template>
  <!-- routes -->
  <div class="routes btn-group">
    <div class="menu-dropdown">
      <button
        id="button"
        @click="btnMenu"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="inside"
      >
        <div id="icon"></div>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <RouterLink
            to="/"
            class="dropdown-item"
            @click="
              btnMenu();
              resetFilters();
            "
          >
            Home
          </RouterLink>
        </li>
        <li>
          <a
            href="http://localhost:8000/admin"
            class="dropdown-item ms-menu-link"
            >Dashboard</a
          >
        </li>
      </ul>
    </div>
    <!-- altra routes -->
    <div class="menu-off">
      <button
        id="btn"
        @click="btnMenu()"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#staticBackdrop"
        aria-controls="offcanvasRight"
      >
        <div id="icn"></div>
      </button>
      <div
        class="offcanvas offcanvas-end w-100"
        data-bs-backdrop="static"
        tabindex="-1"
        id="staticBackdrop"
        aria-labelledby="staticBackdropLabel"
      >
        <div class="offcanvas-header btn-position">
          <button
            type="button"
            @click="btnMenu()"
            class="btn"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="offcanvas-body">
          <div class="ms-routes">
            <ul>
              <li>
                <button data-bs-dismiss="offcanvas" aria-label="Close">
                  <RouterLink
                    to="/"
                    class="drop-item"
                    @click="
                      btnMenu();
                      resetFilters();
                    "
                  >
                    Home
                  </RouterLink>
                </button>
              </li>
              <li>
                <button data-bs-dismiss="offcanvas" aria-label="Close">
                  <a
                    href="http://localhost:8000/admin"
                    class="drop-item"
                    @click="btnMenu()"
                  >
                    Dashboard
                  </a>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// menu style
.routes {
  height: 100%;
  width: 125px;
  display: flex;
  align-items: center;
  justify-content: end;
  $blue: rgb(71, 92, 163);

  .menu-dropdown {
    #button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      height: 30px;
      outline: none;
      padding: 0;
      width: 30px;

      &.toggled {
        #icon {
          background-color: transparent;

          &:before {
            top: 0;
            transform: rotate(-45deg);
          }

          &:after {
            bottom: 0;
            transform: rotate(45deg);
          }
        }
      }

      #icon {
        background-color: $blue;
        border-radius: 100px;
        height: 3px;
        position: relative;
        transition: all 0.25s;
        width: 30px;

        &:before,
        &:after {
          background-color: $blue;
          border-radius: 100px;
          content: "";
          height: 3px;
          left: 0;
          position: absolute;
          transition: all 0.25s;
          width: 30px;
        }

        &:before {
          top: -8px;
        }

        &:after {
          bottom: -8px;
        }
      }
    }

    ul {
      li {
        .ms-menu-link {
          a {
            color: black;
            text-decoration: none;
          }
        }
      }
    }
  }

  .menu-off {
    display: none;
  }
}

@media only screen and (max-width: 700px) {
  .myContainer {
    .routes {
      width: fit-content;
      $blue: rgb(71, 92, 163);
      .menu-dropdown {
        display: none;
      }

      .menu-off {
        display: inline-block;
        #btn {
          background-color: transparent;
          border: none;
          cursor: pointer;
          height: 30px;
          outline: none;
          padding: 0;
          width: 30px;

          &.toggled {
            #icn {
              background-color: transparent;

              &:before {
                top: 0;
                transform: rotate(-45deg);
              }

              &:after {
                bottom: 0;
                transform: rotate(45deg);
              }
            }
          }

          #icn {
            background-color: $blue;
            border-radius: 100px;
            height: 3px;
            position: relative;
            transition: all 0.25s;
            width: 30px;

            &:before,
            &:after {
              background-color: $blue;
              border-radius: 100px;
              content: "";
              height: 3px;
              left: 0;
              position: absolute;
              transition: all 0.25s;
              width: 30px;
            }

            &:before {
              top: -8px;
            }

            &:after {
              bottom: -8px;
            }
          }
        }

        #staticBackdrop {
          .btn-position {
            display: flex;
            justify-content: end;
            height: fit-content;

            .btn {
              font-size: 2em;
              margin: 0;
              padding: 0;
              padding-inline: 10px;
              height: fit-content;
              background-color: $blue;
              color: white;
            }
          }

          .offcanvas-body {
            display: flex;
            align-items: center;
            .ms-routes {
              width: 100%;
              ul {
                padding: 0;
                margin: 0;
                list-style: none;
                li {
                  height: fit-content;
                  display: flex;
                  flex-direction: column;
                  align-items: end;
                  justify-content: center;
                  padding-right: 2em;
                  button {
                    background-color: transparent;
                    border: 0;

                    .drop-item {
                      color: $blue;
                      text-decoration: none;
                      font-size: 3em;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
