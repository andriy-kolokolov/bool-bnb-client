import 'bootstrap';
import './assets/main.scss';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import AOS from "aos";
import "aos/dist/aos.css";

auth.initialize(); // check if already logged in

const app = createApp(App);
app.use(router);
app.use(AOS);
app.mount('#app');
