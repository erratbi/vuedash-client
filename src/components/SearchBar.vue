<template>
  <div id="search-bar">
    <i class="fa fa-search"></i>
    <input type="text" @keyup="search()" v-model="q" placeholder="Product title or Buyer username">
  </div>
</template>


<script>
export default {
  data() {
    return {
      q: ""
    };
  },
  methods: {
    async search() {
      if (this.q.trim().length === 0) this.$store.dispatch("search", "");
      // if (this.q.length < 3) return;
      this.$store.dispatch("search", this.q);
    }
  }
};
</script>


<style scoped lang="scss">
#search-bar {
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.015);
  padding: 20px;
  margin: 60px 0;

  i.fa {
    position: absolute;
    font-size: 25px;
    height: 50px;
    line-height: 50px;
    color: gray;
  }

  input {
    border: none;
    height: 50px;
    min-width: 90%;
    margin-left: 35px;

    &:focus {
      outline: none;
    }
  }
}
</style>
