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
                <q-card-section class="q-px-none">
                  <span class="fix-px">НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ</span>
                  <q-list class="q-pa-none q-ma-none">
                    <q-item @click="statusDialog = true" class="q-pa-none q-ma-none" clickable v-ripple>
                      <q-item-section class="q-pa-none fix-px" avatar>
                        <q-icon color="black" name="school"/>
                      </q-item-section>
                      <q-item-section>Задать статус</q-item-section>
                    </q-item>
                    <q-item @click="profileDialog = true" class="q-pa-none q-ma-none" clickable v-ripple>
                      <q-item-section class="q-pa-none fix-px" avatar>
                        <q-icon color="black" name="person_pin"/>
                      </q-item-section>
                      <q-item-section>Моя учетная запись</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-separator/>
              </template>
              <q-card-section class="q-px-none">
                <span class="fix-px" >НАСТРОЙКИ САЙТА</span>
                <q-list class="q-pa-none q-ma-none">
                  <q-item @click="appearanceDialog = true" class="q-pa-none q-ma-none" clickable v-ripple>
                    <q-item-section class="q-pa-none fix-px" avatar>
                      <q-icon color="black" name="palette"/>
                    </q-item-section>
                    <q-item-section>Внешний вид</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-separator/>
              <q-card-section class="q-px-none">
                <span class="fix-px">ИНФОРМАЦИЯ О САЙТЕ</span>
                <q-list class="q-pa-none q-ma-none">
                  <q-item @click="supportDialog = true" class="q-pa-none q-ma-none" clickable v-ripple>
                    <q-item-section class="q-pa-none fix-px" avatar>
                      <q-icon color="black" name="report"/>
                    </q-item-section>
                    <q-item-section>Поддержка</q-item-section>
                  </q-item>
                  <q-item @click="goUrl('https://boosty.to/gistud.info')" class="q-pa-none q-ma-none" clickable v-ripple>
                    <q-item-section class="q-pa-none fix-px" avatar>
                      <q-icon color="black" name="paid"/>
                    </q-item-section>
                    <q-item-section>Поддержать проект</q-item-section>
                  </q-item>
                  <q-item disable class="q-pa-none q-ma-none" clickable v-ripple>
                    <q-item-section class="q-pa-none fix-px" avatar>
                      <q-icon color="black" name="emoji_events"/>
                    </q-item-section>
                    <q-item-section>Благодарности</q-item-section>
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

      <q-dialog maximized square v-model="profileDialog" transition-show="slide-left" transition-hide="slide-right">
        <q-card flat square>
          <q-card-section class="row q-pa-none q-ma-none">
            <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
            <span class="title-page">Моя учетная запись</span>
          </q-card-section>
          <q-separator/>
          <q-card-section class="q-pa-none fix-pt">
            <span class="fix-px">ИНФОРМАЦИЯ ОБ УЧЕТНОЙ ЗАПИСИ</span>
            <q-list class="q-pa-none q-ma-none">
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                  <q-item-section class="fix-py fix-px">Имя пользователя</q-item-section>
                  <q-item-section class="fix-py fix-px" side  style="font-size: 10px">4gname#0000</q-item-section>
              </q-item>
              <q-item class="q-pa-none q-ma-none" clickable v-ripple>
                <q-item-section class="fix-py fix-px">Электронная почта</q-item-section>
                <q-item-section class="fix-py fix-px" side style="font-size: 10px">4gname@gistud.info</q-item-section>
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

      <q-dialog maximized square v-model="appearanceDialog" transition-show="slide-left" transition-hide="slide-right">
        <q-card flat square>
          <q-card-section class="row q-pa-none q-ma-none">
            <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
            <span class="title-page">Внешний вид</span>
          </q-card-section>
          <q-separator/>
          <q-card-section class="q-pa-none fix-pt">
            <span class="fix-px">ТЕМА</span>
            <q-list class="q-pa-none q-ma-none">
              <q-item @click="setDarkTheme()" class="q-pa-none q-ma-none" clickable v-ripple>
                <q-item-section class="fix-py fix-px">Темная</q-item-section>
                <q-item-section class="fix-px" side>
                  <q-toggle @click="setDarkTheme()" class="fix-px q-py-none" v-model="darkTheme" color="grey"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog maximized square v-model="supportDialog" transition-show="slide-left" transition-hide="slide-right">
        <q-card flat square>
          <q-card-section class="row q-pa-none q-ma-none">
            <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
            <span class="title-page">Связаться с нами</span>
          </q-card-section>
          <q-separator/>
          <q-card-section class="q-pa-none fix-pt">
            <span class="fix-px">УКАЖИТЕ ВАШ EMAIL</span>
            <q-input square style="margin-bottom: 5px" filled type="text" v-model="requestDialogEmail"
                     label="Email адрес *" lazy-rules
                     :rules="[(val) => !!val || 'Поле не может быть пустым', isValidEmail]" autofocus/>
          </q-card-section>
          <q-card-section class="q-pa-none fix-pt">
            <span class="fix-px">УКАЖИТЕ ВАШЕ СООБЩЕНИЕ</span>
            <q-input square input-style="resize: none;" counter filled rows="10" type="textarea"
                     v-model="requestDialogText" label="Текст *" lazy-rules
                     :rules="[(val) => (!!val && val.length >= 1 && val.length <= 500) || 'Текст сообщения не может быть меньше 1 символов или больше 500']"
                     autofocus/>
          </q-card-section>
          <q-card-section>
            <q-btn v-close-popup flat color="primary" no-caps label="Отправить" :disable="sendButtonModel"
                   @click="sendUserMessage(requestDialogEmail, requestDialogText, '/userMessages/bug')"/>
            <q-btn v-close-popup flat color="primary" no-caps label="Отмена"/>
          </q-card-section>
        </q-card>
      </q-dialog>

    </q-card>


  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import EventBus from "../../common/eventBus";
import {useRouter} from 'vue-router';
import {Dark, useQuasar} from 'quasar'
import {goUrl} from "src/services/other/tools";
import UtilsService from "src/services/other/utilsService";
import UnivRequestService from "src/services/other/userMessagesService";

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

    const darkTheme = ref(false);

    onMounted(() => {
      let user = store.getters["auth/getCurrentUser"];
      if (user !== null) {
        let roles = user.roles;
        roles && roles.includes("ROLE_ADMIN") ? isAdmin.value = true : isAdmin.value = false;
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

    onBeforeUnmount(() => {
      EventBus.remove("logout");
    });

    const $q = useQuasar();
    const requestDialogEmail = ref('');
    const requestDialogText = ref('');
    const sendButtonModel = ref(true);

    watch(requestDialogEmail, (newValue) => {
      sendButtonModel.value = !validateInputs(newValue, requestDialogText.value);
    })

    watch(requestDialogText, (newValue) => {
      sendButtonModel.value = !validateInputs(requestDialogEmail.value, newValue);
    })

    const validateInputs = (email, text) => {
      let valid = true;
      if (email.length === 0 || UtilsService.isValidEmail(email) === 'Недопустимый email') {
        valid = false;
      }
      if (text.length < 1 || text.length > 500) {
        valid = false;
      }
      return valid;
    }

    const sendUserMessage = (email, text, url) => {
      UnivRequestService.createUserMessage(email, text, url)
      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Сообщение успешно отправлено",
      });
    }

    return {
      loggedIn,
      currentUser: computed(() => store.state.auth.user),
      dialogModel,
      logout,
      isAdmin,
      statusDialog: ref(false),
      profileDialog: ref(false),
      appearanceDialog: ref(false),
      supportDialog: ref(false),
      Dark,
      darkTheme,
      setDarkTheme,
      goUrl,
      requestDialogEmail,
      requestDialogText,
      sendButtonModel,
      isValidEmail(val) {
        return UtilsService.isValidEmail(val);
      },
      sendUserMessage,
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
