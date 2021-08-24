<template>
  <q-card class="flex flex-center">
    <q-card-section>
      <q-page class="flex flex-center">
        <div class="q-pa-md" style="max-width: 400px">
          <q-form
            @submit="handleRegister({ username, email, password })"
            @reset="onReset"
            class="q-gutter-md"
            justify
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
              type="email"
              v-model="email"
              label="Email адрес *"
              lazy-rules
              :rules="[
                (val) => !!val || 'Поле не может быть пустым',
                isValidEmail,
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
              <q-btn label="Зарегистрироваться" type="submit" color="primary"/>
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
      </q-page>
    </q-card-section>
  </q-card>
</template>

<script>
import {useStore} from "vuex";
import {ref, computed, onMounted} from "vue";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import UtilsService from "../services/other/utilsService"

export default {
  name: "Register",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const username = ref(null);
    const email = ref(null);
    const password = ref(null);
    const message = ref(null);
    const loggedIn = ref(store.state.auth.loggedIn);

    onMounted(() => {
      if (loggedIn.value) {
        router.push("/");
      }
    });

    return {
      loggedIn,
      username,
      email,
      password,
      message,

      async handleRegister(user) {
        message.value = "";
        try {
          const {data} = await store.dispatch("auth/registerAction", user);
          message.value = data;
          const loginData = await store.dispatch("auth/loginAction", {
            username: user.username,
            password: user.password
          });
          console.log("loginData: " + loginData.data);

          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Успешная регистрация",
          });
          router.push("/");
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
        email.value = null;
        password.value = null;
      },

      isValidEmail(val) {
        return UtilsService.isValidEmail(val);
      }
    };
  },
};
</script>

<style></style>
