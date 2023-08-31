<script>
import { store } from "@/store/store.js";
export default {
  data() {
    return {
      store,
      isLogged: false,
    };
  },
  methods: {
    btnMenu() {
      const button = document.getElementById("button");
      const btn = document.getElementById("btn");
      button.classList.toggle("toggled");
      btn.classList.toggle("toggled");
    },
  }
}
</script>

<template>
  <nav>
    <div class="myContainer">
      <!-- logo -->
      <RouterLink to="/" class="image">
        <img
          src="../assets/img/logo-orizzontale.png"
          alt="logo"
          class="ms-total"
        />
        <img src="../assets/img/logo-b.png" alt="logo-small" class="ms-small" />
      </RouterLink>

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
          <form class="d-flex flex-column gap-5">
            <!-- input -->
            <div class="d-flex gap-2 align-items-center justify-content-center">
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
                    <option selected></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
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
                    <option selected></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>

              <!-- slider -->
              <div class="slidecontainer">
                <label for="km">Kilometers</label>
                <input
                  type="range"
                  name="km"
                  min="1"
                  max="100"
                  value="50"
                  class="slider"
                  id="myRange"
                />
              </div>
            </div>

            <!-- checkbox -->
            <div>
              <label class="container"
                >Seavices 1
                <input type="checkbox" checked="checked" />
                <span class="checkmark"></span>
              </label>
              <label class="container"
                >Services 2
                <input type="checkbox" />
                <span class="checkmark"></span>
              </label>
            </div>

            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <button class="mySearch">Search</button>
            </div>
          </form>
        </div>
      </div>

      <!-- routes -->
      <div class="routes btn-group">
        <div class="menu-dropdown">
          <button
            id="button"
            @click="btnMenu()"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="inside"
          >
            <div id="icon"></div>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <RouterLink to="/" class="dropdown-item" @click="btnMenu()">
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
            <li>
                <RouterLink to="/about" class="dropdown-item" @click="btnMenu()">
                  About
                </RouterLink>
              </li>
            <li>
              <a
                href="http://localhost:8000/login"
                class="dropdown-item ms-menu-link"
                >Login</a
              >
            </li>
            <li>
              <a
                href="http://localhost:8000/register"
                class="dropdown-item ms-menu-link"
                >Register</a
              >
            </li>
            <li @click="btnMenu()">
              <button
                v-if="store.auth.authenticated"
                @click="store.auth.signOut()"
                class="dropdown-item"
              >
                Sign Out
              </button>
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
                      <RouterLink to="/" class="drop-item" @click="btnMenu()">
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
                  <li>
                    <button data-bs-dismiss="offcanvas" aria-label="Close">
                      <RouterLink
                        to="/about"
                        class="drop-item"
                        @click="btnMenu()"
                      >
                        About
                      </RouterLink>
                    </button>
                  </li>
                  <li>
                    <button data-bs-dismiss="offcanvas" aria-label="Close">
                      <a
                        v-if="!isLogged"
                        href="http://localhost:8000/login"
                        class="drop-item"
                        @click="btnMenu()"
                      >
                        Login
                      </a>
                    </button>
                  </li>
                  <li>
                    <button data-bs-dismiss="offcanvas" aria-label="Close">
                      <a
                        v-if="!isLogged"
                        href="http://localhost:8000/register"
                        class="drop-item"
                        @click="btnMenu()"
                      >
                        Register
                      </a>
                    </button>
                  </li>
                  <li>
                    <button
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                      @click="btnMenu()"
                    >
                      <a
                        v-if="store.auth.authenticated"
                        @click="store.auth.signOut()"
                        class="drop-item"
                      >
                        Logout
                      </a>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  height: 70px;
  width: 100%;
  background-color: rgb(245, 245, 245);
  border-bottom: 1px solid rgb(220, 220, 220);
  //   box-shadow: 0 3px 10px rgb(150, 150, 150);

  .myContainer {
    height: 100%;
    width: 90%;
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .image {
    height: 55%;
    img {
      height: 100%;
    }

    .ms-total {
      display: inline-block;
      width: 125px;
    }

    .ms-small {
      display: none;
    }
  }

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

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
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
      background: #04aa6d;
      cursor: pointer;
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
      top: 0;
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
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

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
        padding: 0px;
        width: 30px;

        &.toggled {
          #icon {
            background-color: transparent;

            &:before {
              top: 0px;
              transform: rotate(-45deg);
            }

            &:after {
              bottom: 0px;
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
            left: 0px;
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
}

@media only screen and (max-width: 700px) {
  .myContainer {
    .image {
      .ms-total {
        display: none;
      }

      .ms-small {
        display: inline-block;
      }
    }

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
          padding: 0px;
          width: 30px;

          &.toggled {
            #icn {
              background-color: transparent;

              &:before {
                top: 0px;
                transform: rotate(-45deg);
              }

              &:after {
                bottom: 0px;
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
              left: 0px;
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

@media only screen and (max-width: 650px) {
  .myContainer {
    .search {
      .myInput {
        width: 300px;
      }
    }
  }
}

@media only screen and (max-width: 500px) {
  .myContainer {
    .search {
      .myInput {
        width: 200px;
      }
    }
  }
}

@media only screen and (max-width: 350px) {
  .myContainer {
    .search {
      .myInput {
        width: 150px;
      }
    }
  }
}
</style>
