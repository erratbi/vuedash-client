<template>
  <div>
    <sidebar/>
    <div id="page">
      <h1>Dashboard coming soon</h1>
      <router-link to="/orders/paid">Orders list</router-link>
    </div>
  </div>
</template>


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
