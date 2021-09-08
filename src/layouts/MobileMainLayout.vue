<template>
  <q-layout view="lhh LpR lFf">
    <!--BODY-->
    <q-page-container>
      <router-view/>
    </q-page-container>

    <!--HEADER-->
  </q-layout>
</template>

<script>

import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'MobileMainLayout',

  components: {
  },
})
</script>
<style>
</style>
