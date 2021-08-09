<template>
  <!-- <div class="col-md-12">
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
  </div> -->
  <div class="q-pa-md" style="max-width: 400px">
    <q-form
      @submit="handleLogin({ username, password })"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="username"
        label="Имя пользователя *"
        hint="Латинские символы и цифры"
        lazy-rules
        :rules="[
          (val) =>
            (!!val && val.length >= 6 && val.length <= 16) ||
            'Имя пользователя должно быть в пределах от 6 до 16 символов',
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Пароль *"
        lazy-rules
        :rules="[
          (val) =>
            (!!val && val.length >= 6 && val.length <= 20) ||
            'Пароль должен содержать от 6 до 20 символов',
        ]"
      />

      <div>
        <q-btn label="Войти" type="submit" color="primary" />
        <q-btn
          label="Очистить"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const username = ref(null);
    const password = ref(null);
    const message = ref(null);
    const loggedIn = ref(store.state.auth.loggedIn);
    if (loggedIn.value) {
      router.push("/");
    }

    return {
      loggedIn,
      username,
      password,
      message,

      async handleLogin(user) {
        try {
          const data = await store.dispatch("auth/loginAction", user);
          console.log(data);
          console.log(localStorage.getItem("user"));
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Успешная авторизация",
          });
          await router.push("/");
        } catch (e) {
          message.value = e.response.data.message;
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message,
          });
        }
      },

      onReset() {
        username.value = null;
        password.value = null;
      },
    };
  }
};
</script>

<style></style>
