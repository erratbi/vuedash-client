import axios from "axios";

const Api = axios.create({
  baseURL: `http://localhost:3333/api`,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const setHeaderAuth = (token = null) => {
  if (token) Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else Api.defaults.headers.common["Authorization"] = null;
};

export default Api;
