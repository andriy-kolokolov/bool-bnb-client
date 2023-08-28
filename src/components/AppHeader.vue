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
      button.classList.toggle("toggled");
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
      width: 130px;
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
}

@media only screen and (max-width: 1000px) {
  .ms-total {
    display: none;
  }

  .ms-small {
    display: inline-block;
  }
}
</style>
