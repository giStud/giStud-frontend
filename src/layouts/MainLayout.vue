<template>
  <q-layout>
    <Header class="mobile-hide"/>
    <mobileHeader class="desktop-hide"/>
    <q-page-container class="q-pa-none">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'
import Header from '../components/Header.vue'
import mobileHeader from '../components/mobile/mobileHeader.vue'
import Footer from '../components/Footer.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    Header,
    mobileHeader,
    // Footer
  },

  /*setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }*/
})
</script>
