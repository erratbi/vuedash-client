import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home";
import Login from "@/views/Login";
import NewOrders from "@/views/NewOrders";
import ShippedOrders from "@/views/ShippedOrders";
import ConfirmedOrders from "@/views/ConfirmedOrders";
import ModeratePaidOrders from "@/views/ModeratePaidOrders";
import ModerateShippedOrders from "@/views/ModerateShippedOrders";
import CancelledOrders from "@/views/CancelledOrders";
import store from "@/store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        auth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: "/orders/paid",
      name: "paid",
      component: NewOrders,
      meta: {
        auth: true,
        admin: true
      }
    },
    {
      path: "/orders/shipped",
      name: "shipped",
      component: ShippedOrders,
      meta: {
        auth: true,
        admin: true
      }
    },
    {
      path: "/orders/confirmed",
      name: "confirmed",
      component: ConfirmedOrders,
      meta: {
        auth: true,
        admin: true
      }
    },
    {
      path: "/orders/cancelled",
      name: "cancelled",
      component: CancelledOrders,
      meta: {
        auth: true,
        admin: true
      }
    },
    {
      path: "/mod/orders/paid",
      name: "mod_orders",
      component: ModeratePaidOrders,
      meta: {
        auth: true,
        moderator: true
      }
    },
    {
      path: "/mod/orders/shipped",
      name: "mod_shipped",
      component: ModerateShippedOrders,
      meta: {
        auth: true,
        moderator: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (localStorage.getItem("user") == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    } else {
      let user = JSON.parse(localStorage.getItem("user"));
      store.commit("userLoggedIn", user);
      if (to.matched.some(record => record.meta.admin)) {
        if (user.isAdmin) {
          next();
        } else {
          next({ name: "login" });
        }
      } else if (to.matched.some(record => record.meta.moderator)) {
        if (user.isModerator) {
          next();
        } else {
          next({ name: "login" });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem("user") == null) {
      next();
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

export default router;
