<template>
  <div id="list">
    <div  v-if="orders.length">
      <table class="table">
        <tr>
          <th style="width: 40px" class="text-center">#</th>
          <th style="width: 120px;" class="text-center">Photo</th>
          <th width="20%">Product</th>
          <th>Buyer</th>
          <th class="text-center">Qte</th>
          <th class="text-center">Size</th>
          <th class="text-center">Tracking</th>
          <th class="text-center" v-if="type === 'shipped' && who === 'moderator'">Edit</th>
          <th class="text-center" v-if="type === 'shipped' && who === 'admin'">Confirm</th>
        </tr>
        <tr v-for="order in orders" :key="order.number">
          <td>{{ order.number }}</td>
          <template v-if="who === 'admin' && type === 'paid'">
            <td v-if="order.poster">
              <lightbox :thumbnail="order.poster" :images="[order.poster]">
                <lightbox-default-loader slot="loader"></lightbox-default-loader>
              </lightbox>
            </td>
            <td v-else>
              <div class="photo empty" @click="loadProductImg(order)">
                <div v-if="!order.loadingImg">+</div>
                <div v-else class="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </td>
          </template>
          <template v-else>
            <td>
              <div v-if="order.poster">
                <lightbox :thumbnail="order.poster" :images="[order.poster, ...order.images]">
                  <lightbox-default-loader slot="loader"></lightbox-default-loader>
                </lightbox>
              </div>
              <div v-else-if="order.images">
                <lightbox :thumbnail="order.images[0]" :images="order.images">
                  <lightbox-default-loader slot="loader"></lightbox-default-loader>
                </lightbox>
              </div>
              <div v-else class="no-pic">No Picture</div>
            </td>
          </template>
          <td>{{ order.product.title }}</td>
          <td v-if="who === 'moderator' || type === 'confirmed'">
            <strong>Full name</strong>: {{ order.buyer.fullName }}<br>
            <strong>Address line1</strong>: {{ order.buyer.address1 }}<br>
            <span v-if="order.buyer.address2">
                <strong>Address line2</strong>: {{ order.buyer.address2 }}<br>
              </span>
            <strong>Zip code</strong>: {{ order.buyer.zip }}<br>
            <strong>City</strong>: {{ order.buyer.city }}<br>
            <strong>State</strong>: {{ order.buyer.state }}<br>
            <strong>Country</strong>: {{ order.buyer.country }}<br>
          </td>
          <td v-else>{{ order.buyer.fullName }}</td>
          <td class="text-center">{{ order.quantity }}</td>
          <td class="text-center"><strong>{{ order.size }}</strong></td>
          <template v-if="type === 'paid'">
            <td class="text-center">
              <button v-if="!order.tracking" @click="setTracking(order)" class="btn btn-outline-primary"><i class="fa fa-plus"></i></button>
              <button v-else @click="setTracking(order)" class="btn btn-success"><i class="fa fa-check"></i></button>
            </td>
          </template>
          <template v-else-if="type === 'shipped' && who === 'moderator'">
            <td class="text-center">{{ order.tracking }}</td>
            <td class="text-center">
              <button @click="setTracking(order)" class="btn btn-outline-primary"><i class="fa fa-pencil"></i></button>
            </td>
          </template>
          <template v-else-if="type === 'shipped' && who === 'admin'">
            <td class="text-center">{{ order.tracking }}</td>
            <td class="text-center">
              <button @click="confirmShipment(order)" class="btn btn-success"><i class="fa fa-check"></i></button>
            </td>
          </template>
          <template v-else-if="type === 'confirmed'">
            <td class="text-center">{{ order.tracking }}</td>
          </template>
          <template v-else>
            <td>{{ order.tracking }}</td>
          </template>
        </tr>
      </table>
      <order-modal :showModal="showModal" :currentOrder="currentOrder" @close="showModal = false" />
    </div>
    <div v-else class="empty-list">
      <p>No products were found</p>
    </div>
  </div>
</template>

<script>
import OrderModal from "@/components/OrderModal";
import OrderService from "@/services/OrderService";

export default {
  components: { OrderModal },
  data() {
    return {
      showModal: false,
      images: [],
      currentOrder: {
        product: {},
        buyer: {}
      }
    };
  },
  props: {
    orders: Array,
    type: {
      type: String,
      default: "paid"
    },
    who: {
      type: String,
      default: "admin"
    }
  },

  mounted() {
    this.$store.dispatch("loadOrders");
  },

  methods: {
    setTracking(order) {
      this.currentOrder = order;
      this.showModal = true;
    },

    async confirmShipment(order) {
      try {
        const resp = await OrderService.confirmShipment(order);
        order.status = resp.status;
      } catch (e) {
        // TODO: Track error
      }
    },

    async loadProductImg(order) {
      if (order.loadingImg) return;
      order.loadingImg = true;
      try {
        const resp = await OrderService.loadOrderImg(order.number);
        if (!resp.error) order.poster = resp.image;
      } catch (e) {
        // TODO: Track error
      }

      order.loadingImg = false;
    }
  }
};
</script>


<style lang="scss" scoped>
#list {
  .table {
    th {
      color: #b7bdd4;
      font-size: 12px;
      border: none;
      padding: 5px 10px;
    }

    tr {
      &:nth-child(even) {
        background-color: #f5f8ff;
      }
    }

    td {
      font-size: 15px;
      padding: 10px;
      border: none;
      border-bottom: 1px dashed #bbd5e9;
      vertical-align: middle;

      .no-pic {
        font-weight: bold;
        font-size: 11px;
        text-align: center;
        color: #d88;
      }

      .photo {
        .lds-ring {
          margin-top: 18px;
        }

        img {
          width: 100px;
          height: 100px;
        }

        &.empty {
          border: 1px solid #eee;
          width: 100px;
          height: 100px;
          line-height: 100px;
          text-align: center;
          font-size: 30px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
