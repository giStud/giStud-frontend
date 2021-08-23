<template>
  <div class="q-pa-md" style="min-width: 1248px; padding-left: 24px; padding-right: 24px">
      <q-toolbar class="bg-primary text-white">
        <q-avatar id="logo" square>
          <img src="../assets/logoWhiteGray.svg">
        </q-avatar>

        <q-separator class="separator" dark vertical inset/>

        <q-btn class="nav-btn" :to="'/'" stretch flat label="Главная"/>
        <q-btn class="nav-btn" :to="{name: 'schedule', query : {univName: 'ВГТУ'}}" stretch flat label="Расписание"/>
        <q-btn class="nav-btn" :to="'#'" stretch flat label="Доска объявлений"/>
        <q-btn class="nav-btn" :to="'#'" stretch flat label="Почетные хейтеры"/>

        <q-space/>

        <template v-if="!loggedIn">
          <q-separator dark vertical/>
          <q-btn class="nav-btn-auth" :to="'/auth/login'" stretch  flat label="Войти"/>
          <q-separator dark vertical/>
          <q-btn class="nav-btn-auth" :to="'/auth/signup'" stretch flat label="Зарегистрироваться"/>
        </template>
        <template v-else>

          <q-btn class="nav-btn-auth" stretch flat> {{ currentUser.username }}</q-btn>
          <q-separator dark vertical/>
          <q-btn class="nav-btn-auth" @click="logout" stretch flat label="Выйти"/>
        </template>
      </q-toolbar>

  </div>
</template>

<script>
import {useStore} from "vuex";
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import {useRouter} from "vue-router";
import EventBus from "../common/eventBus";

export default {
  name: "Header",

  setup() {
    const store = useStore();
    const router = useRouter();
    const loggedIn = computed(() => store.state.auth.loggedIn);

    const logout = () => {
      store.dispatch("auth/logoutAction");
      router.push("/");
    };

    onMounted(() => {
      EventBus.on("logout", () => {
        logout();
      });
    });

    onBeforeUnmount(() => {
      EventBus.remove("logout");
    });

    return {
      loggedIn,
      currentUser: computed(() => store.state.auth.user),
      logout

    };
  },
};
</script>

<style></style>
