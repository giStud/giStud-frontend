<template>
  <div id="box-universities">

    <q-card flat square class="box-university my-card">
      <q-parallax src="../../assets/media/universities/VGTU/VGTU.jpg" :height="300" :speed="0.4"/>
      <q-card-section>
        <div class="text-h6 text-bold">Воронежский государственный технический университет</div>
        <div class="text-subtitle2"> Воронежский государственный архитектурно-строительный университет — существовавшее
          самостоятельно до лета 2016 года высшее учебное заведение города Воронежа. В настоящее время объединён с
          Воронежским государственным техническим университетом.
        </div>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <q-btn flat no-caps class="btn-university" :to="{name: 'schedule', query : {univName: 'ВГТУ'}}">Расписание</q-btn>
        <q-btn flat no-caps class="btn-university" @click="url('https://cchgeu.ru/')">Официальный сайт</q-btn>
      </q-card-section>
    </q-card>

    <!--  new box box-university  -->

    <q-card flat square class="box-university my-card">
      <q-parallax src="../../assets/media/universities/unknown.jpg" :height="300" :speed="0.4"/>
      <q-card-section>
        <div class="text-h6 text-bold">Ваш университет</div>
        <div class="text-subtitle2">Вы можете оставить заявку на добавление вашего вуза.</div>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <q-btn flat no-caps class="btn-university" @click="dialogModel = true">Оставить заявку</q-btn>
        <UserMessageDialog v-model="dialogModel" :url="'/userMessages/univRequest'">
          <template v-slot:title>
            <div class="text-h6">Введите текст вашей заявки</div>
          </template>
        </UserMessageDialog>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {ref} from "vue";
import UserMessageDialog from "components/UserMessageDialog";

export default {

  name: "TemplateUniversity",
  components : {
    UserMessageDialog
  },
  setup() {
    const dialogModel = ref(false);
    const url = (string) => {
      window.open(string);
    };

    return {
      dialogModel,
      url
    }
  }
}
</script>

<style lang="css">
@import '../../css/home.css';
</style>
