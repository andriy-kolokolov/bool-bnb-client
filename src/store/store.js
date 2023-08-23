import { reactive } from "vue";

export const store = reactive({
  search: new URLSearchParams(window.location.search).get("q"),
  baseUrlApi: "http://127.0.0.1:8000/api/",
  backEndStorageURL: "http://127.0.0.1:8000/storage/",
});