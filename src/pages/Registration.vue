<script>
import {store} from "@/store/store.js";

export default {
  name: 'registration',
  components: {},
  data() {
    return {
      store,
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      }
    }
  },
  methods: {
    register() {
      store.auth.register(this.form);
    },
  }
}
</script>

<template>
  <div class="container mt-5">
    <h2>Registration Form</h2>
    <form @submit.prevent="register">

      <label for="username">Username:</label>
      <input type="text" id="username" name="username" v-model="form.username" required>

      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="form.email" required>
      </div>

      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" v-model="form.password" required>
      </div>

      <div>
        <label for="confirm_password">Confirm Password:</label>
        <input type="password" id="confirm_password" name="confirm_password" v-model="form.confirmPassword" required>
      </div>

      <div>
        <button type="submit">
          Register
        </button>
      </div>

    </form>
  </div>
</template>

<style scoped>

</style>