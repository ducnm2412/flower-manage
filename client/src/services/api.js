import axios from "axios";

const api = axios.create({
  baseURL: "https://flower-api-pi1v.onrender.com",
});

export default api;
