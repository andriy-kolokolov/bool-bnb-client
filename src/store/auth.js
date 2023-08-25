import axios from "axios";
import {store} from "@/store/store.js";
import router from "@/router.js";

export default {
    token: null,
    user: null,
    authenticated: false,

    initialize() {
        const storedToken = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedToken && storedUser) {
            this.token = storedToken;
            this.user = storedUser;
            this.authenticated = true;
        }
    },

    async register(formData) {
        try {
            let response = await axios.post(store.baseUrlApi + 'auth/register', formData);
            this.logInUser(response.data.token, response.data.user);
            await router.push('/dashboard');
        } catch (error) {
            console.log(error.response.data);
        }
    },

    async signIn(credentials) {
        try {
            let response = await axios.post(store.baseUrlApi + 'auth/login', credentials);
            this.logInUser(response.data.token, response.data.user);
            await router.push('/dashboard');
        } catch (error) {
            console.log(error.response.data);
        }
    },

    signOut() {
        this.user = null;
        this.token = null;
        this.authenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("User logged out");
    },

    logInUser(token, user) {
        this.token = token;
        this.user = user;
        this.authenticated = true;
        localStorage.setItem("token", token);
    }
};
