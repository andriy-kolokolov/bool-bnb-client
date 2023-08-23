<script>
import axios from "axios";
import {store} from "../store";

export default {
	data() {
		return {
			store,
			apartment: null,
		};
	},
	created() {
		const id = this.$route.params.id;
		axios
			.get(`${this.store.baseUrlApi}apartments/all/${id}`)
			.then((response) => {
				this.apartment = response.data;
			});
		console.log(this.apartment);
	},
};
</script>

<template></template>

<style></style>
