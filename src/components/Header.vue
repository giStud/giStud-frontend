<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-primary text-white q-my-md shadow-2">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-separator dark vertical inset />
      <q-btn :to="'/groupSelecting'" stretch flat label="Расписание" />

      <q-space />

      <template v-if="!loggedIn">
        <q-separator dark vertical />
        <q-btn :to="'/login'" stretch flat label="Войти" />
        <q-separator dark vertical />
        <q-btn :to="'/signup'" stretch flat label="Зарегистрироваться" />
      </template>
      <template v-else>
        <q-separator dark vertical />
        <q-btn stretch flat> {{ currentUser.username }}</q-btn>
        <q-separator dark vertical />
        <q-btn @click="logout" stretch flat label="Выйти" />
      </template>
    </q-toolbar>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Header",

  setup() {
    const store = useStore();
    const router = useRouter();
    const loggedIn = computed(() => store.state.auth.loggedIn)

    return {
      loggedIn,
      currentUser: computed(() => store.state.auth.user),

      logout() {
        store.dispatch("auth/logoutAction");
        router.push("/");
      },
    };
  },
};
</script>

<style></style>
