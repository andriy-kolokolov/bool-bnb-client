import 'bootstrap';
import './assets/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import auth from "@/store/auth.js";

auth.initialize(); // check if already logged in

const app = createApp(App);
app.use(router);
app.mount('#app');