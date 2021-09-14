<template>
  <q-layout>
    <Header class="mobile-hide" />
    <mobileHeader class="desktop-hide" />
    <q-page-container class="q-pa-none">
      <router-view />
    </q-page-container>

    <q-dialog v-if="confirm === 'true'" v-model="dialog" persistent>
      <q-card square>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">
            <p>Привет!</p>
            <p>Наш сайт не работал почти неделю, все из-за того что нашего провайдера взломали хакеры.</p>
            <p>К сожалению, все наши данные были утеряны, сейчас сайт восстановлен с нуля, и работает в тестовом режиме.</p>
            <p>Для того, чтобы держать вас в курсе событий, мы создали телеграм канал, вступайте и следите за новостями.</p>
            Спасибо что вы с нами!
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="bg-primary no-border-radius" color="white" v-close-popup flat href="https://t.me/gistud_info" label="Перейти в telegram" target="_blank" type="a" @click="confirm = 'false'" />
          <q-btn class="bg-primary no-border-radius" color="white" v-close-popup flat label="Ок" @click="confirm = 'false'" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>

import {defineComponent, onMounted, ref, watch} from 'vue'
import Header from '../components/Header.vue'
import mobileHeader from '../components/mobile/mobileHeader.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    Header,
    mobileHeader,
    // Footer
  },
  setup() {
    const dialog = ref(true);
    const confirm = ref('true');
    onMounted(async () => {
      confirm.value = (localStorage.getItem("dialogTelega") === null) ? 'true' : localStorage.getItem("dialogTelega");
    });
    watch(confirm, (val) => {
      localStorage.setItem("dialogTelega", val ? 'false' : 'true')
    });

    return {
      confirm,
      dialog
    };
  }
})
</script>
