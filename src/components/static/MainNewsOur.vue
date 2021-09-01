<template>
  <div class="q-pa-md news-by-our mobile-hide">
    <q-carousel :autoplay="10000" animated v-model="slide" arrows navigation infinite>
      <q-carousel-slide :name="1" img-src="../../assets/media/news/1.jpg"/>
      <q-carousel-slide :name="2" img-src="../../assets/media/news/2.jpg"/>
    </q-carousel>
  </div>

  <q-card flat square class="desktop-hide">
    <q-carousel class="col-ads" style="width: 100%;" :autoplay="10000" animated v-model="slide" navigation  infinite swipeable>
      <q-carousel-slide :name="1" img-src="../../assets/media/news/1.jpg"/>
      <q-carousel-slide :name="2" img-src="../../assets/media/news/2.jpg"/>
    </q-carousel>
  </q-card>

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
