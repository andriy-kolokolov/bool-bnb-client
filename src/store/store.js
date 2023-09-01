import { reactive } from "vue";
import auth from './auth.js';

export const store = reactive({
  search: new URLSearchParams(window.location.search).get("q"),
  baseUrlApi: "http://localhost:8000/api/",
  backEndStorageURL: "http://localhost:8000/storage/",
  auth: auth,
  radius: 1,
});
