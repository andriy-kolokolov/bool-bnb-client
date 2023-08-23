<script>
import {store} from "@/store/store.js";

export default {
  name: 'signin',
  components: {},
  data() {
    return {
      store,
      form: {
        email: '',
        password: '',
      }
    }
  },
  methods: {
    submit() {
      store.auth.signIn(this.form)
    }
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <label for="email">
        Email
      </label>
      <input type="text" name="email" id="email" v-model="form.email">
    </div>
    <div>
      <label for="password">
        Password
      </label>
      <input type="password" name="password" id="password" v-model="form.password">
    </div>
    <div>
      <button type="submit">
        Sign In
      </button>
    </div>
  </form>

</template>

<style scoped>

</style>