import axios from "axios";
import {store} from "@/store/store.js";
import router from "@/router.js";

export default {
    token: null,
    user: null,
    authenticated: false,

    initialize() {
        const storedToken = localStorage.getItem("token");
        const storedUserString = localStorage.getItem("user");
        const storedUser = JSON.parse(storedUserString);
        if (storedToken && storedUser) {
            this.token = storedToken;
            this.user = storedUser;
            this.authenticated = true;
        } else {
            console.log("user is not authenticated");
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
            console.error(error.response.data);
        }
    },

    async signOut() {
        this.user = null;
        this.token = null;
        this.authenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("User logged out");
        await router.push('/');
    },

    logInUser(token, user) {
        this.token = token;
        this.user = user;
        this.authenticated = true;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(this.user));
        console.log(user)
    }
};
