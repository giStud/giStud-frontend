<template>
  <div id="news-by-our" class="q-pa-md">
    <q-carousel animated v-model="slide" arrows navigation infinite>
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg"/>
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg"/>
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg"/>
      <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg"/>
    </q-carousel>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "MainNewsOur",

  setup() {
    return {
      slide: ref(1)
    }
  }
}

</script>
<style lang="css">
@import 'src/css/home.css';
</style>
