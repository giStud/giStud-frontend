<template>
  <div id="news-by-our" class="q-pa-md">
    <q-carousel :autoplay="10000" animated v-model="slide" arrows navigation infinite>
      <q-carousel-slide :name="1" img-src="../../assets/media/news/1.jpg"/>
      <q-carousel-slide :name="2" img-src="../../assets/media/news/2.jpg"/>
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
