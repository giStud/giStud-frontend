<template>
  <q-layout view="lhh LpR lFf">
    <!--BODY-->
    <q-page-container>
      <router-view/>
    </q-page-container>

    <!--HEADER-->
    <q-footer>
        <mHeader/>
    </q-footer>
  </q-layout>
</template>

<script>

import {defineComponent, ref} from 'vue'
import mHeader from '../pages/mobile/components/mHeader.vue'

export default defineComponent({
  name: 'MobileMainLayout',

  components: {
    mHeader,
  },
})
</script>
<style>
body {
  background-color: #edeef0;
  font-family: 'Play', sans-serif;
  min-width: 280px;
}
</style>
