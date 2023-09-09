import 'bootstrap';
import './assets/main.scss';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import AOS from "aos";
import "aos/dist/aos.css";
import auth from "@/store/auth.js";

const app = createApp(App);
app.use(router);
app.use(AOS);
auth.initialize(); // set authenticated user in local storage (if authenticated)
app.mount('#app');
