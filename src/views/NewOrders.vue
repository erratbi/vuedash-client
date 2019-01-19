<template>
  <div>
    <sidebar />
    <div id="page">
      <div class="heading d-flex">
        <div>
          <h1>New Orders</h1>
          <small>Orders that are awaiting shipping</small>
        </div>

        <div class="upload ml-auto">
          <upload-box class="upload-box"/>
        </div>
      </div>
      <search-bar/>
      <orders-list :orders="orders" />
    </div>
  </div>
</template>

<script>
import UploadBox from "@/components/UploadBox";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import OrdersList from "@/components/OrdersList";

export default {
  components: { UploadBox, SearchBar, Sidebar, OrdersList },

  mounted() {
    this.$store.dispatch("loadOrders");
  },

  computed: {
    orders() {
      return this.$store.getters.newOrders;
    }
  }
};
</script>


<style lang="scss" scoped>
#page {
  padding: 60px 60px 60px 360px;

  .upload {
    width: 160px;
    height: 40px;
    position: relative;
    overflow: hidden;
  }

  .heading {
    h1 {
      color: #556299;
      font-size: 30px;
      margin-bottom: 5px;
    }

    small {
      color: #b2b8d1;
      font-size: 14px;
    }
  }
}
</style>
