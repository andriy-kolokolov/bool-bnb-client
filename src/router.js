import {createRouter, createWebHistory} from 'vue-router';
import Home from "../src/pages/Home.vue";
import About from "../src/pages/About.vue";
import Apartment from "../src/pages/Apartment.vue";
import SignIn from "@/pages/SignIn.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Registration from "@/pages/Registration.vue";
import auth from "@/store/auth.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/about',
            name: 'about',
            component: About,
        },
        {
            path: '/apartment/:id',
            name: 'apartment',
            component: Apartment,
        },
        {
            path: '/signin',
            name: 'signin',
            component: SignIn
        },
        {
            path: '/register',
            name: 'register',
            component: Registration
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {requiresAuth: true}
        }
    ],
});

// Secure route guard
router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Route requires authentication
        if (!auth.authenticated) {
            next('/signin'); // User is not authenticated, redirect to login
        } else {
            next(); // User is authenticated, proceed to the route
        }
    } else {
        next(); // Route does not require authentication, proceed
    }
});

export default router;
