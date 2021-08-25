<template>
  <div id="box-universities">

    <div class="box-university col-12 row">
      <div class="col-5 img-university">
        <q-img class="img-university-src" src="../../assets/media/universities/VGTU/VGTU.jpg" loading="lazy"
               spinner-color="white" height="300px"/>
      </div>
      <div class="col-7 content-university">
        <div>
          <span class="title-university">Воронежский государственный технический университет</span>
          <p>
            Воронежский государственный архитектурно-строительный университет — существовавшее самостоятельно до лета
            2016
            года высшее учебное заведение города Воронежа. В настоящее время объединён с Воронежским государственным
            техническим университетом.
          </p>
        </div>
        <div>
          <q-btn flat no-caps class="btn-university" :to="{name: 'schedule', query : {univName: 'ВГТУ'}}">Расписание</q-btn>
          <q-btn flat no-caps class="btn-university" @click="url('https://cchgeu.ru/')">Официальный сайт</q-btn>
        </div>
      </div>
    </div>
    <div class="box-university col-12 row">
      <div class="col-5 img-university">
        <q-img class="img-university-src" src="../../assets/media/universities/unknown.jpg" loading="lazy"
               spinner-color="white" height="300px"/>
      </div>
      <div class="col-7 content-university">
        <div>
          <span class="title-university">Ваш университет</span>
          <p>
            Вы можете оставить заявку на добавление вашего вуза-гавнуза.
          </p>
        </div>
        <div>
          <q-btn flat no-caps class="btn-university" @click="univRequestDialog = true">Оставить заявку</q-btn>
          <q-dialog v-model="univRequestDialog">
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Введите текст вашей заявки</div>
              </q-card-section>
              <q-card-section style="width: 460px">
                <div>
                  <q-input
                    style="margin-bottom: 5px"
                    filled
                    type="text"
                    v-model="requestDialogEmail"
                    label="Email адрес *"
                    lazy-rules
                    :rules="[(val) => !!val || 'Поле не может быть пустым', isValidEmail]"
                    autofocus
                  />
                  <q-input
                    input-style="resize: none;"
                    counter
                    filled
                    rows="10"
                    type="textarea"
                    v-model="requestDialogText"
                    label="Текст *"
                    lazy-rules
                    :rules="[(val) => (!!val && val.length >= 6 && val.length <= 500) || 'Текст сообщения не может быть меньше 6 символов или больше 500']"
                    autofocus
                  />
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions align="right">
                <q-btn v-close-popup flat color="primary" no-caps label="Отправить" :disable="sendButtonModel" @click="sendUnivRequest(requestDialogEmail, requestDialogText)"/>
                <q-btn v-close-popup flat color="primary" no-caps label="Отмена"/>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, watch} from "vue";
import UtilsService from "../../services/other/utilsService"
import UnivRequestService from "../../services/other/univRequestService"

export default {

  name: "TemplateUniversity",
  setup() {
    const requestDialogEmail = ref('');
    const requestDialogText = ref('');
    const sendButtonModel = ref(true);
    const univRequestDialog = ref(false);

    const url = (string) => {
      window.open(string);
    };

    watch(requestDialogEmail, (newValue)=> {
      sendButtonModel.value = !validateInputs(newValue, requestDialogText.value);
    })

    watch(requestDialogText, (newValue)=> {
      sendButtonModel.value = !validateInputs(requestDialogEmail.value, newValue);
    })

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

    const sendUnivRequest = (email, text) => {
      UnivRequestService.createNewUnivRequest(email, text);
    }

    return {
      requestDialogEmail,
      requestDialogText,
      univRequestDialog,
      sendButtonModel,
      isValidEmail(val) {
        return UtilsService.isValidEmail(val);
      },
      sendUnivRequest,
      url
    }
  }
}
</script>

<style lang="css">
@import '../../css/home.css';
</style>
