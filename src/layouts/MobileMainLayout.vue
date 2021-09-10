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
import mHeader from '../pages/mobile/components/mHeader.vue'
import {defineComponent, computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {Dark} from 'quasar'

export default defineComponent({
  name: 'MobileMainLayout',
  components: {
    mHeader,
  },
  setup() {
    return {
    }
  }
})
</script>
<style>
body {
  font-family: 'Play', sans-serif;
  min-width: 280px;
}
</style>
