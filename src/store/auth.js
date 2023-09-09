
import axios from "axios";
import {store} from "@/store/store.js";

export default {
    user: null,
    // save user in storage on init and/or refresh site page, getting from storage
    initialize() {
        axios.get(store.baseUrlApi + "get-auth-user")
            .then(response => {
                if (typeof response.data.user[0] === 'object' && response.data.user[0] !== undefined) {
                    this.user = response.data.user[0];
                    localStorage.setItem('user', JSON.stringify(this.user));
                    console.log(JSON.parse(localStorage.getItem('user')));
                } else {
                    console.log('user is not authenticated')
                }
            })
            .catch(error => {
                console.error("Error fetching authenticated user:", error);
            }).finally(() => {

        });

    }
}
