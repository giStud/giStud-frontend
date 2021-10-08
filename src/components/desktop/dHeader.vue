<template>
  <q-card :class="theme('bg-l', 'bg-d')" class="bg-main row items-center q-pa-none flex-center" flat>

    <q-card-section class="items-center q-pa-none q-px-sm">
      <q-btn class=" q-pa-none bg-none" :to="'/'" flat>
        <q-avatar style="width: 150px" class="q-pa-none" square>
          <q-img
            src="https://cdn.discordapp.com/attachments/887281514809802806/889423709033619496/newLogoTest.svg"
          />
        </q-avatar>
      </q-btn>
    </q-card-section>

    <q-card-section class="q-pa-none q-px-none q-px-sm">
      <q-list class="row justify-evenly items-center">
        <q-btn flat no-caps :to="'/'" class="btn-menu text-size-menu">Главная</q-btn>
        <q-btn flat no-caps :to="'/schedule'" class="btn-menu text-size-menu">Расписание</q-btn>
        <q-btn flat no-caps :to="'/news'" class="btn-menu text-size-menu">Новости</q-btn>
        <q-btn disable flat no-caps :to="''"  class="btn-menu gistud-dev text-size-menu">Доска объявлений</q-btn>
        <q-btn flat no-caps @click="goUrl('https://boosty.to/gistud.info')" class="btn-menu text-size-menu">Поддержать проект</q-btn>
      </q-list>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-card flat square class="row items-center bg-none">
        <q-card-section class="q-pa-none q-px-sm">
          <input disabled :class="theme('search-box-l', 'search-box-d')" autocomplete="off" type="text" name="search" placeholder="Поиск" class="q-pa-sm search-box gistud-dev"/>

        </q-card-section>

        <q-card-section class="q-pa-none q-px-sm">
          <q-btn :class="theme('two-btn-l', '')" flat icon="fas fa-adjust" round size="10px" @click="setDarkTheme()"></q-btn>
          <q-btn disable class="gistud-dev" :class="theme('two-btn-l', '')" flat icon="fas fa-bullhorn" round size="10px"></q-btn>
        </q-card-section>

        <q-card-section class="items-center q-pa-none q-pl-sm">
          <q-btn-dropdown :disable="!isAdmin" class="gistud-dev" :style="isAdmin ? '' : theme('color: white', 'color: #2e2f31')" no-caps flat :label="currentUser === null ? 'Кто здесь ?' : currentUser.username">
            <div class="row q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Настройки</div>
                <q-toggle v-model="mobileData" label="Уведомления" />
                <q-btn no-caps flat outline label="Админка" size="sm" v-if="isAdmin" :to="'/admin'" />
              </div>
              <q-separator vertical inset class="q-mx-md" />
              <div class="column items-center">
                <q-avatar size="72px" v-if="currentUser !== null">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
                <div v-if="currentUser !== null" class="text-subtitle1 q-mt-md q-mb-md">{{ currentUser.username }}</div>
                <q-btn v-if="currentUser !== null" @click="logout()" flat label="Выйти" push size="sm" v-close-popup/>
                <q-btn v-if="currentUser === null" @click="logout()" flat label="Войти" push size="sm" v-close-popup/>
              </div>
            </div>
          </q-btn-dropdown>
        </q-card-section>

      </q-card>
    </q-card-section>
  </q-card>
</template>

<script>
import {goUrl, theme} from "src/services/other/tools";
import {computed, onMounted, ref, watch} from "vue";
import {Dark} from "quasar";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  name: "dHeader",
  setup() {
    const store = useStore();
    const router = useRouter();
    const dialogModel = ref(false);
    const loggedIn = computed(() => store.getters['auth/isLogged']);
    const isAdmin = ref(false);
    /**
     * TODO Delete this after creating normal authorization
     */
    const logout = () => {
      isAdmin.value = false;
      store.dispatch("auth/logoutAction");
      router.push("/profile");
    };
    const login = () => {

    }

    const darkTheme = ref(false);

    onMounted(() => {
      store.commit('globalState/changeCurrentPage','profile');
      let user = store.getters["auth/getCurrentUser"];
      if (user !== null) {
        let roles = user.roles;
        isAdmin.value = roles && roles.includes("ROLE_ADMIN");
      }
      darkTheme.value = Dark.isActive;
    });

    const setDarkTheme = () => {
      Dark.toggle();
      darkTheme.value = Dark.isActive;
    }

    watch(darkTheme, (val) => {
      localStorage.setItem("darkTheme", val ? '1':'0')
    });

    return {
      darkTheme,
      isAdmin,
      currentUser: computed(() => store.getters['auth/getCurrentUser']),
      ph: ref(''),
      dense: ref(true),
      Dark,
      mobileData: ref(false),
      bluetooth: ref(false),
      theme,
      goUrl,
      setDarkTheme,
      logout,
    }
  }
}
</script>

<style scoped>

.gistud-dev {
  /*display: none;*/
}

.text-size-menu {
  font-size: 12px;
}

.bg-none {
  background: none;
}

.bg-main {
  min-height: 50px;
  max-height: 50px;
  border-radius: inherit;
}

.bg-d {
  background-color: #2e2f31;
  border-bottom: 1px solid #282b2f;
}

.bg-l {
  background-color: #fff;
  border-bottom: 1px solid #cfd0d2;
}

.btn-menu {
  align-items: center
}

.two-btn-l {
  color: #a3a3a3;
}

.search-box {

}

.search-box {
  width: 180px;
  height: 26px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
  padding: 12px 20px 12px 30px;
  background-size: 16px;
  background-position: 5px 5px;
  background-repeat: no-repeat;
  border: 0 solid #a3a3a3;
}

.search-box-l {
  background-image: url('https://cdn.discordapp.com/attachments/887281514809802806/889373223895068733/search-solid-l.svg');
  background-color: #edeef0;
}
.search-box-d {
  background-image: url('https://cdn.discordapp.com/attachments/887281514809802806/889373218392141854/search-solid-d.svg');
  background-color: #3f4349;
  color: white;
}
</style>
