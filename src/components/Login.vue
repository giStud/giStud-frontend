<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <Form @submit="handleLogin" :validation-schema="schema">
        <div class="form-group">
          <label for="username">Username</label>
          <Field name="username" type="text" class="form-control" />
          <ErrorMessage name="username" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Field name="password" type="password" class="form-control" />
          <ErrorMessage name="password" class="error-feedback" />
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Login</span>
          </button>
        </div>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
  
</template>

<script>
import {mapActions, useStore} from "vuex";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("Username is required!"),
      password: yup.string().required("Password is required!"),
    });

    return {
      loading: false,
      message: "",
      schema
    };
  },
  computed: {
    loggedIn() {
      console.log("logged in method")
      return this.$store.state.auth.loggedIn;
    },
  },
  created() {
    console.log("login created method")
    if (this.loggedIn) {
      console.log("login redirect to profile")
      this.$router.push("/profile");
    }
  },
  methods: {
    ...mapActions("auth", ["loginAction"]),
    async handleLogin(user) {
      this.loading = true;

      try {
        const data = await this.loginAction(user);
        console.log(data)
        console.log(localStorage.getItem('user'))
        await this.$router.push("/profile");
      } catch(e) {
        this.loading = false;
        this.message = e.response.data.message;
      }
    },
  },
};
</script>

<style></style>
