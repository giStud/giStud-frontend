<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Header/>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-grey-8 text-white">
      <Footer/>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'AuthLayout',

  components: {
    Header,
    Footer
  },


}
</script>

<style>

</style>
