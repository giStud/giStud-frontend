<template>
  <q-layout>
    <Header/>
    <q-page-container>
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
