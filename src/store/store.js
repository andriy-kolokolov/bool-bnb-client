import { reactive } from "vue";

export const store = reactive({
  search: new URLSearchParams(window.location.search).get("q"),
  baseUrlApi: "http://localhost:8000/api/",
  backEndStorageURL: "http://localhost:8000/storage/",

  // dati per filtri
  longitude: "",
  latitude: "",
  radius: 20,
  selectedRooms: 1,
  selectedBeds: 1,
  selectedServices: [],
});
