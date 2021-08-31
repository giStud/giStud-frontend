<template>
  <div class="q-pa-md" style="min-width: 1248px; padding-left: 24px; padding-right: 24px">
      <q-toolbar class="bg-primary text-white">
        <q-avatar id="logo" square>
          <img src="../assets/logo.svg">
        </q-avatar>

        <q-separator dark vertical inset/>

        <q-btn class="nav-btn" :to="'/'" stretch flat label="Главная"/>
        <q-btn class="nav-btn"  :to="'/schedule'" stretch flat label="Расписание"/>

        <q-space/>

        <q-separator dark vertical inset/>
        <q-btn class="nav-btn-auth" @click="dialogModel = true" stretch flat label="Нашли ошибку?"/>
        <UserMessageDialog v-model="dialogModel" :url="'/userMessages/bug'">
          <template v-slot:title>
            <div class="text-h6">Введите описание вашей ошибки</div>
          </template>
        </UserMessageDialog>
<!--        <template v-if="!loggedIn">-->
<!--          <q-separator dark vertical inset/>-->
<!--          <q-btn class="nav-btn-auth" :to="'/auth/login'" stretch  flat label="Войти"/>-->
<!--          <q-separator dark vertical inset/>-->
<!--          <q-btn class="nav-btn-auth" :to="'/auth/signup'" stretch flat label="Зарегистрироваться"/>-->
<!--        </template>-->
<!--        <template v-else>-->

<!--          <q-btn class="nav-btn-auth" stretch flat> {{ currentUser.username }}</q-btn>-->
<!--          <q-separator dark vertical inset/>-->
<!--          <q-btn class="nav-btn-auth" @click="logout" stretch flat label="Выйти"/>-->
<!--        </template>-->
      </q-toolbar>

  </div>
</template>

<script>
import {useStore} from "vuex";
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import {useRouter} from "vue-router";
import UserMessageDialog from "components/UserMessageDialog";
import EventBus from "../common/eventBus";

export default {
  name: "Header",
  components : {
    UserMessageDialog
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const dialogModel = ref(false);
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
      dialogModel,
      logout

    };
  },
};
</script>

<style>

</style>
