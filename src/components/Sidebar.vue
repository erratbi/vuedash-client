<template>
  <div id="sidebar">
    <div class="avatar">
      <div class="thumb">
        {{ user.isAdmin ? "A" : "M" }}
      </div>
      <p class="username">{{ user.isAdmin ? "Administrator" : "Moderator" }}</p>
    </div>
    <ul class="menu">
      <li>
        <router-link active-class="active" exact to="/">Dashboard</router-link>
      </li>
      <li>
        <router-link active-class="active" :to="`/${user.isModerator ? 'mod/' : ''}orders/paid`">New Orders</router-link>
      </li>
      <li>
        <router-link active-class="active" :to="`/${user.isModerator ? 'mod/' : ''}orders/shipped`">Shipped</router-link>
      </li>
      <template v-if="user.isAdmin">
        <li>
          <router-link active-class="active" to="/orders/confirmed">Completed</router-link>
        </li>
        <li>
          <router-link active-class="active" to="/orders/cancelled">Canceled</router-link>
        </li>
      </template>
    </ul>
    <button class="btn btn-primary btn-logout" @click="logout()">Logout</button>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    logout() {
      this.$store.commit("userLoggedOut");
      this.$nextTick(() => this.$router.push("/login"));
    }
  }
};
</script>

<style scoped lang="scss">
#sidebar {
  background-color: #fff;
  width: 300px;
  padding: 40px;
  left: 0;
  top: 0;
  min-height: 100vh;
  position: fixed;
  box-shadow: 5px 0 10px rgba(150, 150, 150, 0.03);

  .btn-logout {
    position: absolute;
    bottom: 30px;
    display: block;
    width: 80%;
    margin: 0 auto;
    left: 0;
    right: 0;
  }

  .avatar {
    text-align: center;
    margin-bottom: 60px;
    margin-top: 30px;

    .thumb {
      margin: 0 auto;
      width: 100px;
      height: 100px;
      background-color: orange;
      border-radius: 100%;
      color: white;
      font-size: 60px;
      font-weight: 100;
    }

    .username {
      font-size: 16px;
      color: #6671a1;
      margin-top: 15px;
    }
  }

  .menu {
    color: #b5bad2;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin-bottom: 10px;

      a {
        padding: 15px 20px;
        display: block;
        transition: background-color 0.3s ease-out;
        color: #b5bad2;
        border-radius: 100px;
        font-size: 15px;

        &.active,
        &:hover {
          background-color: #e7f3ff;
          text-decoration: none;
          color: #449fff;
        }
      }
    }
  }
}
</style>
