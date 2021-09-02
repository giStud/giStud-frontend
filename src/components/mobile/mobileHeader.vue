<template>
  <q-header elevated >
    <q-toolbar class="bg-primary text-white">
      <q-avatar id="logo" square>
        <img src="../../assets/logo.svg">
      </q-avatar>
      <q-space/>
      <q-btn flat @click="menuMobile = !menuMobile" round dense icon="menu"/>
      <q-drawer side="right" v-model="menuMobile" :width="150" :breakpoint="500" overlay bordered class="bg-white shadow-24">
        <q-scroll-area class="fit">
          <q-list>
            <q-item>
              <q-item-section style="color: black; font-weight: bold">МЕНЮ</q-item-section>
            </q-item>
            <q-separator/>
            <q-item class="qitem-menu" style="color: black" :to="'/'" clickable>
              <q-item-section>Главная</q-item-section>
            </q-item>
            <q-item class="qitem-menu" style="color: black" :to="'/schedule'" clickable>
              <q-item-section>Расписание</q-item-section>
            </q-item>
            <q-separator/>
            <q-item class="qitem-menu" style="color: black" @click="dialogModel = true" flat clickable>
              <q-item-section style="color: black">Нашли ошибку?
                <UserMessageDialog v-model="dialogModel" :url="'/userMessages/bug'">
                  <template v-slot:title>
                    <div>Введите описание вашей ошибки</div>
                  </template>
                </UserMessageDialog>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
    </q-toolbar>
  </q-header>
</template>

<script>
import {useStore} from "vuex";
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import {useRouter} from "vue-router";
import EventBus from "../../common/eventBus";
import UserMessageDialog from "components/UserMessageDialog";

export default {
  name: "mobileHeader",
  components: {
    UserMessageDialog
  },
  setup() {
    const menuMobile = ref(false);
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
      menuMobile,
      logout

    };
  },
};
</script>

<style lang="css" scoped>
@import 'src/css/home.css';
</style>
