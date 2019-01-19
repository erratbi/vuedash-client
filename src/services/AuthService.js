import Api from "@/services/Api";

export default {
  login(user) {
    return Api.post("/auth", user).then(response => response.data);
  }
};
