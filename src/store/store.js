import { reactive } from "vue";

export const store = reactive({
  search: new URLSearchParams(window.location.search).get("q"),
  baseUrlApi: "http://localhost:8000/api/",
  backEndStorageURL: "http://localhost:8000/storage/",
  arrApartments: [],
});
