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
  },
};
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
      <form class="search">
        <input class="myInput" type="text" />
        <button class="myBtn">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

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
              <RouterLink to="/about" class="dropdown-item" @click="btnMenu()">
                About
              </RouterLink>
            </li>
            <li>
              <RouterLink
                v-if="store.auth.authenticated"
                to="/dashboard"
                class="dropdown-item"
                @click="btnMenu()"
                >Dashboard</RouterLink
              >
            </li>
            <li>
              <RouterLink
                v-if="!store.auth.authenticated"
                to="/signin"
                class="dropdown-item"
                @click="btnMenu()"
                >Sign In</RouterLink
              >
            </li>
            <li>
              <RouterLink
                v-if="!store.auth.authenticated"
                to="/register"
                class="dropdown-item"
                @click="btnMenu()"
                >Register</RouterLink
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
                      <RouterLink
                        to="/dashboard"
                        class="drop-item"
                        @click="btnMenu()"
                      >
                        Dashboard
                      </RouterLink>
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
    }

    .ms-small {
      display: none;
    }
  }

  .search {
    display: flex;
    align-items: center;
    background-color: white;
    box-shadow: 0 5px 10px rgb(200, 200, 200);
    border: 1px solid rgb(200, 200, 200);
    border-radius: 100px;
    padding-right: 10px;
    .myInput {
      border: 0;
      border-bottom-left-radius: 100px;
      border-top-left-radius: 100px;
      outline: none;
      height: 40px;
      width: 250px;
      padding-left: 20px;
    }
    .myBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 20px;
      color: white;
      background-color: rgb(71, 92, 163);
      font-size: 15px;
      outline: none;
      height: 30px;
      width: 30px;
      transition: 0.2s ease;

      &:hover {
        background-color: rgb(58, 78, 143);
        transition: 0.2s ease;
      }
    }
  }

  .routes {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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
    .search {
      .myInput {
        width: 150px;
      }
    }

    .routes {
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
</style>
