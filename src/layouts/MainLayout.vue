<template>
  <q-layout>
    <Header/>
    <q-page-container class="q-pa-none">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    Header,
  },
})
</script>
