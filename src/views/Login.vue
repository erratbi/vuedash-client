<template>
  <div class="container">
    <form novalidate class="mt-5 col-lg-6 offset-lg-3 col-10 offset-1" @submit.prevent="submit()">
      <div class="form-group" :class="{'has-error': errors.email}">
        <label for="email">Email address</label>
        <input type="email" class="form-control" :class="{'is-invalid': errors.email}" id="email" name="email" v-model="email" placeholder="Enter email" required>
        <p class="invalid-feedback" v-if="errors.email">{{ errors.email }}</p>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" :class="{'is-invalid': (errors.password || errors.global)}" id="password" name="password" v-model="password" placeholder="Password" required>
        <p class="invalid-feedback" v-if="errors.password">{{ errors.password }}</p>
        <p class="invalid-feedback" v-if="errors.global">{{ errors.global }}</p>
      </div>
      <button type="submit" :disabled="loading" class="btn btn-primary">Submit</button>
    </form>
  </div>
  <!--<div id="login" class="center aligned ui stackable grid container">-->
  <!--<div class="ten tiny eight wide left aligned column">-->
  <!--<div class="ui message negative" v-if="errors.global">-->
  <!--<h1 class="header">Something went wrong</h1>-->
  <!--<p>{{ errors.global }}</p>-->
  <!--</div>-->
  <!--<form novalidate class="ui form" @submit.prevent="submit()">-->
  <!--<div class="field" :class="{error: errors.email}">-->
  <!--<label>Email</label>-->
  <!--<input type="email" v-model="email" placeholder="example@domain.com">-->
  <!--<div class="danger" v-if="errors.email">{{ errors.email }}</div>-->
  <!--</div>-->
  <!--<div class="field" :class="{error: errors.password}">-->
  <!--<label>Password</label>-->
  <!--<input type="password" v-model="password" placeholder="Password">-->
  <!--<div class="danger" v-if="errors.password">{{ errors.password }}</div>-->
  <!--</div>-->
  <!--<button class="ui button primary" :class="{ loading }">Submit</button>-->
  <!--</form>-->
  <!--</div>-->
</template>

<style lang="scss" scoped>
#login {
  padding-top: 100px;
}

.field {
  .danger {
    padding-top: 5px;
  }
}
</style>

<script>
import { isEmail } from "validator";
import AuthService from "@/services/AuthService";

export default {
  data() {
    return {
      errors: {},
      validated: false,
      email: "",
      password: "",
      loading: false
    };
  },
  methods: {
    validate() {
      const errors = {};
      const { email, password } = this;

      if (!isEmail(email)) errors.email = "Should be an email!";
      if (!password.length) errors.password = "Can't be blank!";

      this.validated = true;

      return errors;
    },

    async submit() {
      if (this.loading) return;

      const { email, password } = this;

      this.loading = true;
      this.errors = this.validate();
      if (Object.keys(this.errors).length) this.loading = false;
      else {
        try {
          const user = await AuthService.login({ email, password });
          if (user) this.$store.dispatch("userLoggedIn", user);
          this.$router.push("/");
        } catch (e) {
          if (e.response) this.errors = e.response.data.errors;
          this.loading = false;
        }
      }
    }
  }
};
</script>
