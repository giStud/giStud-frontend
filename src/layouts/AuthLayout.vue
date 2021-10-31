<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <dHeader/>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-grey-8 text-white">
      <dFooter/>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import dHeader from '../components/desktop/dHeader.vue'
import dFooter from '../components/desktop/dFooter.vue'

export default {
  name: 'AuthLayout',

  components: {
    dHeader,
    dFooter
  },


}
</script>

<style>

</style>
