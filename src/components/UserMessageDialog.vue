<template>
  <q-dialog>
    <q-card square >
      <q-card-section>
        <slot name="title"></slot>
      </q-card-section>
      <q-card-section class="content-center">
        <div>
          <q-input square style="margin-bottom: 5px" filled type="text" v-model="requestDialogEmail"
                   label="Email адрес *" lazy-rules
                   :rules="[(val) => !!val || 'Поле не может быть пустым', isValidEmail]" autofocus/>
          <q-input square input-style="resize: none;" counter filled rows="10" type="textarea"
                   v-model="requestDialogText" label="Текст *" lazy-rules
                   :rules="[(val) => (!!val && val.length >= 6 && val.length <= 500) || 'Текст сообщения не может быть меньше 6 символов или больше 500']"
                   autofocus/>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" no-caps label="Отправить" :disable="sendButtonModel"
               @click="sendUserMessage(requestDialogEmail, requestDialogText)"/>
        <q-btn v-close-popup flat color="primary" no-caps label="Отмена"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {ref, watch} from "vue";
import UtilsService from "src/services/other/utilsService";
import UnivRequestService from "src/services/other/userMessagesService";
import {useQuasar} from "quasar";

export default {
  name: "UserMessageDialog",
  props: {
    url: String
  },
  setup(props) {
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
      if (text.length < 6 || text.length > 500) {
        valid = false;
      }
      return valid;
    }

    const sendUserMessage = (email, text) => {
      UnivRequestService.createUserMessage(email, text, props.url)
      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Сообщение успешно отправлено",
      });
    }

    return {
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

</style>
