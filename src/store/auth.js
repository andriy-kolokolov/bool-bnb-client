import axios from "axios";
import {store} from "@/store/store.js";
import router from "@/router.js";

export default {
    token: null,
    user: null,
    authenticated: false,

    initialize() {
        // Check if there's a token in localStorage
        const storedToken = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedToken && storedUser) {
            this.token = storedToken;
            this.user = storedUser;
            this.authenticated = true;
        }

        // You can also load other user-related data from localStorage if needed.
    },

    async signIn(credentials) {
        try {
            let response = await axios.post(store.baseUrlApi + 'auth/login', credentials);
            this.token = response.data.token;
            this.user = response.data.user;
            this.authenticated = true;

            // Save the token to localStorage
            localStorage.setItem("token", this.token);
            localStorage.setItem("user", JSON.stringify(this.user));

            // Redirect to the dashboard route
            await router.push('/dashboard'); // Use this.$router to access the router instance
        } catch (error) {
            console.log(error.response.data);
        }
    },

    signOut() {
        this.user = null;
        this.token = null;
        this.authenticated = false;
        localStorage.removeItem("token"); // Remove token from localStorage
        localStorage.removeItem("user"); // Remove user from localStorage
        console.log("User logged out");
    }
};
