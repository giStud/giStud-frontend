<template>
  <q-page class="body-color">
    <q-card flat>
      <q-card flat style="max-height: 81px;" square>
        <q-card-section class="row justify-between q-pa-none q-ma-none">
          <span class="title-page">Профиль</span>
          <template v-if="isAdmin /* TODO поправить и сделать что был залогинен пользователь*/">
            <q-btn style="width: 48px;" @click="logout; isAdmin = !isAdmin /* TODO тоже самое*/" flat round
                   icon="logout"/>
          </template>
          <template v-else>
            <q-btn style="width: 48px;" @click="logout; isAdmin = !isAdmin /* TODO тоже самое*/" flat round
                   icon="login"/>
          </template>
        </q-card-section>
        <q-separator/>

        <q-card class="bg-none q-px-none">
          <q-card square flat class="bg-none">
            <template v-if="isAdmin /* TODO поправить и сделать что был залогинен пользователь*/">
              <q-card flat square style="background-color:rgba(114,114,114,0.25);">
                <q-card-section class="row justify-between q-pa-none fix-px fix-py">
                  <q-avatar color="primary" text-color="white">?</q-avatar>
                  <div class="fix-py items-center">
                    <q-avatar class="q-mr-sm" style="margin-top: -2px;" color="green" size="10px"></q-avatar>
                    <span>В сети</span>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-none fix-px fix-pb">
                  <span class="text-h6">4gname<span style="color: gray">#0000</span></span>
                </q-card-section>
              </q-card>
            </template>

            <q-card flat square>
              <template v-if="isAdmin /* TODO поправить и сделать что был залогинен пользователь*/">
                <q-card-section>
                  <span>НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ</span>
                  <q-list class="q-pa-none q-ma-none">
                    <q-item @click="statusDialog = true" class="q-pa-none q-ma-none" clickable v-ripple>
                      <q-item-section class="q-pa-none" avatar>
                        <q-icon color="black" name="school"/>
                      </q-item-section>
                      <q-item-section style="margin-left: -15px">Задать статус</q-item-section>
                    </q-item>
                    <q-item @click="statusProfile = true" class="q-pa-none q-ma-none" clickable v-ripple>
                      <q-item-section class="q-pa-none" avatar>
                        <q-icon color="black" name="person_pin"/>
                      </q-item-section>
                      <q-item-section style="margin-left: -15px">Моя учетная запись</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-separator/>
              </template>
              <q-card-section>
                <span>НАСТРОЙКИ САЙТА</span>
                <q-list class="q-pa-none q-ma-none">
                  <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                    <q-item-section class="q-pa-none" avatar>
                      <q-icon color="black" name="palette"/>
                    </q-item-section>
                    <q-item-section style="margin-left: -15px">Внешний вид</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-separator/>
              <q-card-section>
                <span>ИНФОРМАЦИЯ О САЙТЕ</span>
                <q-list class="q-pa-none q-ma-none">
                  <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                    <q-item-section class="q-pa-none" avatar>
                      <q-icon color="black" name="report"/>
                    </q-item-section>
                    <q-item-section style="margin-left: -15px">Поддержка</q-item-section>
                  </q-item>
                  <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                    <q-item-section class="q-pa-none" avatar>
                      <q-icon color="black" name="emoji_events"/>
                    </q-item-section>
                    <q-item-section style="margin-left: -15px">Благодарности</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-card>
        </q-card>

      </q-card>

      <q-dialog maximized square v-model="statusDialog" transition-show="slide-left" transition-hide="slide-right">
        <q-card flat square>
          <q-card-section class="row q-pa-none q-ma-none">
            <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
            <span class="title-page">Настройка статуса</span>
          </q-card-section>
          <q-separator/>
          <q-card-section class="q-pa-none">
            <q-list class="q-pa-none q-ma-none">
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                <div class="fix-py fix-px items-center">
                  <q-avatar class="q-mr-sm" style="margin-top: -2px;" color="green" size="10px"></q-avatar>
                  <span>В сети</span>
                </div>
              </q-item>
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                <div class="fix-py fix-px items-center">
                  <q-avatar class="q-mr-sm" style="margin-top: -2px;" color="orange" size="10px"></q-avatar>
                  <span>Не активен</span>
                </div>
              </q-item>
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                <div class="fix-py fix-px items-center">
                  <q-avatar class="q-mr-sm" style="margin-top: -2px;" color="grey" size="10px"></q-avatar>
                  <span>Не в сети</span>
                </div>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog maximized square v-model="statusProfile" transition-show="slide-left" transition-hide="slide-right">
        <q-card flat square>
          <q-card-section class="row q-pa-none q-ma-none">
            <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
            <span class="title-page">Моя учетная запись</span>
          </q-card-section>
          <q-separator/>
          <q-card-section class="q-pa-none">
            <span class="fix-pa">ИНФОРМАЦИЯ О САЙТЕ</span>
            <q-list class="q-pa-none q-ma-none">
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                <div class="fix-py fix-px items-center">
                  <span>Имя пользователя</span>
                </div>
              </q-item>
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                <div class="fix-py fix-px items-center">
                  <span>Электронная почта</span>
                </div>
              </q-item>
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                <div class="fix-py fix-px items-center">
                  <span>Изменить пароль</span>
                </div>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>

    </q-card>


  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import EventBus from "../../common/eventBus";
import {useRouter} from "vue-router";

export default {
  name: "mProfile",
  setup() {
    const store = useStore();
    const router = useRouter();
    const dialogModel = ref(false);
    const loggedIn = computed(() => store.state.auth.loggedIn);
    const isAdmin = ref(true);
    /**
     * TODO Delete this after creating normal authorization
     */
    const logout = () => {
      isAdmin.value = false;
      store.dispatch("auth/logoutAction");
      router.push("/profile");
    };

    onMounted(() => {
      let user = store.getters["auth/getCurrentUser"];
      if (user !== null) {
        let roles = user.roles;
        roles && roles.includes("ROLE_ADMIN") ? isAdmin.value = true : isAdmin.value = false;
      }
    });

    onBeforeUnmount(() => {
      EventBus.remove("logout");
    });
    return {
      loggedIn,
      currentUser: computed(() => store.state.auth.user),
      dialogModel,
      logout,
      isAdmin,
      statusDialog: ref(false),
      statusProfile: ref(false),
    }
  }
}
</script>

<style scoped>
.bg-none {
  background-color: rgb(238, 238, 238);
}

.fix-pa {
  padding: 15px;
}

.fix-py {
  padding-top: 15px;
  padding-bottom: 15px;
}

.fix-px {
  padding-right: 15px;
  padding-left: 15px;
}

.fix-pt {
  padding-top: 15px;
}

.fix-pb {
  padding-bottom: 15px;
}

.fix-pr {
  padding-right: 15px;
}

.fix-pl {
  padding-left: 15px;
}

.body-color {
  background-color: #edeef0;
  /*background-color: #0047d4;*/
}

.title-page {
  font-size: 18px;
  padding: 14px 15px;
  line-height: 20px;
}

#top-nav-div {
  width: auto;
  height: 25px;
  font-size: 10px;
  color: gray;
}
</style>
