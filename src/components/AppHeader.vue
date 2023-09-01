<script>
import { store } from "@/store/store.js";
import AppMenu from "./AppMenu.vue";
import AppSearch from "./AppSearch.vue";
import {store} from "@/store/store.js";
import About from "../pages/About.vue";

export default {
  components: {
    AppMenu,
    AppSearch,
  },
  data() {
    return {
      store,
    };
  },
	components: {
		About,
	},

	data() {
		return {
			store,
			isLogged: false,
			radius: 1,
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
      <!-- Logo -->
      <RouterLink to="/" class="image">
        <img
          src="../assets/img/logo-orizzontale.png"
          alt="logo"
          class="ms-total"
        />
        <img src="../assets/img/logo-b.png" alt="logo-small" class="ms-small" />
      </RouterLink>

      <!-- Search -->
      <AppSearch />

      <!-- Menu -->
      <AppMenu />
    </div>
  </nav>
			<div
				class="offcanvas offcanvas-top h-100"
				tabindex="-1"
				id="offcanvasTop"
				aria-labelledby="offcanvasTopLabel">
				<div
					class="offcanvas-header d-flex gap-3 align-items-center justify-content-center">
					<h5 class="offcanvas-title" id="offcanvasTopLabel">Search</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="offcanvas"
						aria-label="Close"></button>
				</div>
				<div
					class="offcanvas-body d-flex align-items-center justify-content-center">
					<form class="d-flex flex-column gap-5">
						<!-- input -->
						<div class="d-flex gap-2 align-items-center justify-content-center">
							<About :radiusProp="radius" />
						</div>

						<!-- selects -->
						<div
							class="d-flex flex-column gap-2 align-items-center justify-content-center">
							<div class="mySelects">
								<div
									class="d-flex flex-column align-items-center justify-content-center">
									<label for="rooms">N. Room</label>
									<select
										class="form-select form-select-sm ms-select"
										name="rooms">
										<option selected></option>
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
									</select>
								</div>
								<div
									class="d-flex flex-column align-items-center justify-content-center">
									<label for="beds">N. Bed</label>
									<select
										class="form-select form-select-sm ms-select"
										name="beds">
										<option selected></option>
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
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
										v-model="radius" />
									<div class="slider-value">{{ radius }} km</div>
								</div>
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
							class="d-flex flex-column align-items-center justify-content-center">
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
						data-bs-auto-close="inside">
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
								class="dropdown-item">
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
						aria-controls="offcanvasRight">
						<div id="icn"></div>
					</button>
					<div
						class="offcanvas offcanvas-end w-100"
						data-bs-backdrop="static"
						tabindex="-1"
						id="staticBackdrop"
						aria-labelledby="staticBackdropLabel">
						<div class="offcanvas-header btn-position">
							<button
								type="button"
								@click="btnMenu()"
								class="btn"
								data-bs-dismiss="offcanvas"
								aria-label="Close">
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
												@click="btnMenu()">
												Dashboard
											</a>
										</button>
									</li>
									<li>
										<button data-bs-dismiss="offcanvas" aria-label="Close">
											<RouterLink
												to="/about"
												class="drop-item"
												@click="btnMenu()">
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
												@click="btnMenu()">
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
												@click="btnMenu()">
												Register
											</a>
										</button>
									</li>
									<li>
										<button
											data-bs-dismiss="offcanvas"
											aria-label="Close"
											@click="btnMenu()">
											<a
												v-if="store.auth.authenticated"
												@click="store.auth.signOut()"
												class="drop-item">
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

  // Logo style
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
}
</style>
