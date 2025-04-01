import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_FIREBASE_API_BASEURL;

const instance = axios.create({
  baseURL: apiBaseUrl,
});

export default instance;
