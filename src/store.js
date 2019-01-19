import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import orderBy from "lodash/orderBy";
import OrderService from "@/services/OrderService";
import { setHeaderAuth } from "@/services/Api";

export default new Vuex.Store({
  state: {
    user: {},
    orders: [],

    filter: {
      q: null,
      page: 1,
      type: null
    }
  },
  getters: {
    user(state) {
      return state.user;
    },

    newOrders(state) {
      const { filter, orders } = state;
      state.filter.type = "paid";

      const newOrders = orders.filter(order => order.status === filter.type);

      return orderBy(newOrders, ["number"], "desc");
    },

    confirmedOrders(state) {
      const { filter, orders } = state;
      state.filter.type = "confirmed";

      const confirmedOrders = orders.filter(
        order => order.status === filter.type
      );

      return orderBy(confirmedOrders, ["number"], "desc");
    },

    shippedOrders(state) {
      const { filter, orders } = state;
      state.filter.type = "shipped";

      const shippedOrders = orders.filter(
        order => order.status === filter.type
      );

      return orderBy(shippedOrders, ["number"], "desc");
    },

    cancelledOrders(state) {
      const { filter, orders } = state;
      state.filter.type = "cancelled";

      const shippedOrders = orders.filter(
        order => order.status === filter.type
      );

      return orderBy(shippedOrders, ["number"], "desc");
    }
  },
  mutations: {
    async search(state, q) {
      const { filter } = state;

      state.filter.q = q;

      state.orders = await OrderService.search(filter).then(orders =>
        orders.map(order => {
          order.loadingImg = false;
          return order;
        })
      );
    },

    async loadOrders(state) {
      state.filter = {
        q: null,
        page: 1,
        type: null
      };

      state.orders = await OrderService.loadOrders().then(orders =>
        orders.map(order => {
          order.loadingImg = false;
          order.trackingSaved = false;
          return order;
        })
      );
    },

    csvUploaded(state, orders) {
      state.orders = orders;
    },

    userLoggedIn(state, user) {
      state.user = user;
      setHeaderAuth(user.token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    userLoggedOut(state) {
      state.user = {};
      setHeaderAuth();
      localStorage.removeItem("user");
    }
  },
  actions: {
    userLoggedIn(context, user) {
      return context.commit("userLoggedIn", user);
    },

    loadOrders(context) {
      context.commit("loadOrders");
    },

    search(context, q) {
      context.commit("search", q);
    },

    confirmShipment(context, order) {
      context.commit("confirmShipment", order);
    }
  }
});
