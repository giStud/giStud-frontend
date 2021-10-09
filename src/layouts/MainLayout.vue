<template>
  <q-layout :class="theme('bg-l', 'bg-d')">
    <dHeader/>
    <q-page-container class="q-pa-none" style="padding-top: 0;">
      <router-view/>
    </q-page-container>
    <q-footer class="bg-none">
      <dFooter class=""/>
    </q-footer>
  </q-layout>
</template>

<script>

import {defineComponent} from 'vue'
import dHeader from '../components/desktop/dHeader.vue'
import dFooter from '../components/desktop/dFooter.vue'
import {theme} from "src/services/other/tools";

export default defineComponent({
  name: 'MainLayout',

  components: {
    dHeader, dFooter,
  },
  setup() {
    return {
      theme,
    }
  }

})
</script>
<style>

body {
  font-family: 'Play', sans-serif;
}

.bg-none {
  background: none;
}

.bg-l {
  background-color: #edeef0;
}

.bg-d {
  background-color: #2e3136;
}
</style>
