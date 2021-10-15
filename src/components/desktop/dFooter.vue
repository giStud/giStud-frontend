<template>
  <q-card :class="theme('bg-l', 'bg-d')" class="bg-main row items-start q-pa-none justify-evenly" flat>
    <q-card-section class="row items-start">
      <q-card-section class=" row items-start q-py-none fix-px">
        <q-card flat square class="bg-none">
          <q-card-section class="title-footer">Карта сайта</q-card-section>
          <q-item clickable :to="'/'" class="text-footer">Главная</q-item>
          <q-item clickable :to="'/schedule'" class="text-footer">Расписание</q-item>
          <q-item clickable :to="'/news'" class="text-footer">Новости</q-item>
<!--          <q-item clickable disable class="text-footer">Доска объявлений</q-item>-->
        </q-card>
      </q-card-section>
      <q-card-section class="row items-start q-py-none fix-px" style="width: 200px">
<!--        <q-card flat square class="bg-none">-->
<!--          <q-card-section class="title-footer">Проект</q-card-section>-->
<!--          <q-item clickable :to="'/about'" class="text-footer">О проекте</q-item>-->
<!--          <q-item clickable class="text-footer">История создания</q-item>-->
<!--          <q-item clickable class="text-footer">Реклама на сайте</q-item>-->
<!--          <q-item clickable disable class="text-footer">Вакансии</q-item>-->
<!--        </q-card>-->
      </q-card-section>
      <q-card-section class="row items-start q-py-none fix-px" style="width: 200px">
<!--        <q-card flat class="bg-none" square >-->
<!--          <q-card-section class="title-footer">База знаний</q-card-section >-->
<!--          <q-item clickable class="text-footer"><span>Найти свое расписание</span></q-item>-->
<!--          <q-item clickable disable class="text-footer">Создать объявление</q-item>-->
<!--        </q-card>-->
      </q-card-section>

      <q-card-section class="row items-start q-py-none fix-px">
        <q-card flat class="bg-none" square >
          <q-card-section class="title-footer row items-start">Обратная связь</q-card-section >
          <input v-model="requestDialogEmail" :class="theme('bg-input-l', 'bg-input-d')" class="text-field__input" style="height: 25px" type="text" name="email" id="email" placeholder="Email">
          <textarea v-model="requestDialogText" :class="theme('bg-input-l', 'bg-input-d')" class="text-field__input" style="height: 70px" type="textarea" name="text" id="text" placeholder="Введите текст"/>
          <q-btn size="sm" v-close-popup flat no-caps label="Отправить" :class="sendButtonModel ? 'hidden' : ''" @click="sendUserMessage(requestDialogEmail, requestDialogText)"/>
        </q-card>
      </q-card-section>
      <q-card-section class="row items-start q-py-none fix-px">
        <q-card flat class="bg-none" square >
          <q-card-section class="title-footer row items-start">Контакты</q-card-section>
          <q-card-section class="text-footer">Мы в социальных сетях</q-card-section>
          <q-btn icon="img:https://cdn.discordapp.com/attachments/886791383740985464/886959234552586240/vk-brands.svg" flat/>
          <q-btn icon="telegram" flat/>
        </q-card>
      </q-card-section>
    </q-card-section>
  </q-card>
  <q-card :class="theme('bg-main-bot-l', 'bg-main-bot-d')" class="q-pa-none q-py-sm bg-main-bot items-center" flat square>
    <q-card-section class="copyright">Кто владеет информацией, тот владеет миром</q-card-section>
    <q-card-section class="copyright">Copyright © | Made by GISTUD</q-card-section>
  </q-card>
</template>

<script>
import {theme} from "src/services/other/tools";
import {ref, watch} from "vue";
import UtilsService from "src/services/other/utilsService";
import {useQuasar} from "quasar";
import UnivRequestService from "src/services/other/userMessagesService";

export default {
  name: "dFooter",
  setup() {
    const $q = useQuasar();
    const requestDialogEmail = ref('');
    const requestDialogText = ref('');
    const sendButtonModel = ref(true);

    const validateInputs = (email, text) => {
      let valid = true;
      if (email.length === 0 || UtilsService.isValidEmail(email) === 'Недопустимый email') {
        valid = false;
      }
      if (text.length < 6 || text.length > 500) {
        valid = false;
      }
      return valid;
    }

    watch(requestDialogEmail, (newValue) => {
      sendButtonModel.value = !validateInputs(newValue, requestDialogText.value);
    })

    watch(requestDialogText, (newValue) => {
      sendButtonModel.value = !validateInputs(requestDialogEmail.value, newValue);
    })

    const sendUserMessage = (email, text) => {
      UnivRequestService.createUserMessage(email, text, '/userMessages/bug')
      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Сообщение успешно отправлено",
      });
    }

    return {
      theme,
      isValidEmail(val) {
        return UtilsService.isValidEmail(val);
      },
      validateInputs, sendUserMessage,
      requestDialogEmail, requestDialogText, sendButtonModel,
    }
  }
}
</script>

<style scoped>

.bg-none {
  background: none;
}

.bg-main {
  margin-bottom: -2px;
  min-height: 202px;
  max-height: 202px;
  border-radius: inherit;
}

.bg-d {
  background-color: #48494d;
  border-bottom: 1px solid #282b2f;
}

.bg-l {
  background-color: #2787f5;
  border-bottom: 1px solid #cfd0d2;
}

.bg-main-bot {
  height: 50px;
  width: 100%;
  border-radius: inherit;
}

.bg-main-bot-d {
  background-color: #2e2f31;
}

.bg-main-bot-l {
  background-color: #185499;
}

.copyright {
  font-size: 12px;
  padding: 0;
  margin: 0;
  text-align: center;
}

.title-footer {
  font-size: 14px;
  padding: 0 8px 15px 8px;
}

.text-footer {
  text-decoration: none;
  align-items: center;
  min-height: 10px;
  padding: 0 8px;
  height: 25px;
  line-height: 12px;
  font-size: 12px;
  margin: 0 0 2px;
}

.text-footer:visited {
  text-decoration: none;
  color: white;
}

.text-field__input {
  display: block;
  width: 195px;
  padding: 2px;
  font-family: inherit;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  background-clip: padding-box;

  border-radius: 2px;
  margin-bottom: 5px;
  resize: none;
}
.text-field__input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.text-field__input:focus {
  color: white;
  outline: 0;
}

.bg-input-d, .bg-input-d:focus {
  background-color: #44474b;
  border: 1px solid #444549;
}

.bg-input-l, .bg-input-l:focus {
  background-color: #2174d2;
  border: 1px solid #2580e8;
}




</style>
