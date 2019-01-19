import Api from "@/services/Api";

export default {
  loadOrders() {
    return Api.get("/orders").then(resp => resp.data);
  },

  updateTracking(order) {
    const { number, tracking } = order;
    return Api.post(`/orders/${number}/tracking`, { tracking }).then(
      resp => resp.data.order
    );
  },

  search(params) {
    return Api.get("/orders/search", { params }).then(resp => resp.data);
  },

  loadOrderImg(number) {
    return Api.post(`/orders/image/${number}`).then(resp => resp.data);
  },

  confirmShipment(order) {
    const { number } = order;
    return Api.post(`/orders/${number}/confirm`).then(resp => resp.data.order);
  },

  deleteImage(order, image) {
    const { number } = order;
    return Api.post(`/orders/${number}/images/delete`, { image }).then(
      resp => resp.data.order.images
    );
  }
};
