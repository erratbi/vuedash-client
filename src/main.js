import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from "moment";
import Lightbox from "vue-pure-lightbox";

Vue.filter("formatDate", value => {
  if (value) {
    return moment(String(value)).format("MM/DD/YYYY");
  }
});

Vue.config.productionTip = false;
Vue.use(Lightbox);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
