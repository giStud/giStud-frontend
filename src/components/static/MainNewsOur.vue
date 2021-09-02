<template>
  <div class="q-pa-md news-by-our mobile-hide">
    <q-carousel :autoplay="10000" animated v-model="slide" arrows navigation infinite>
      <q-carousel-slide :name="1" img-src="../../assets/media/news/1.jpg"/>
      <q-carousel-slide :name="2" img-src="../../assets/media/news/2.jpg"/>
    </q-carousel>
  </div>

  <q-card flat square class="desktop-hide">
    <q-carousel height="440px"  class="col-ads" :autoplay="10000" animated v-model="slide" navigation  infinite swipeable>
      <q-carousel-slide class="column no-wrap flex-center col-ads" :name="1" img-src="../../assets/media/news/mobile/m1.jpg">
        <div class="q-mt-md text-center" style="color: white">
          <h4 style="margin-top: -20px"><b style="border-bottom: 3px solid white">StartUp GISTUD</b></h4>
          <h5 style="margin-top: -16px" >Студенческий информационный сервис</h5>
          <h5 style="font-size: 14px">Мы подключаемся к вашему университету и
            предоставляем информацию в удобном виде</h5>
          <h5 style="font-size: 14px; margin: -10px">На данный момент мы предоставляем:</h5>
          <h5 style="font-size: 14px; margin: -10px">- Расписание</h5>
          <h5 style="font-size: 14px; margin: -10px">- Студенческие новости</h5>
        </div>
      </q-carousel-slide>
      <q-carousel-slide class="column no-wrap flex-center col-ads" :name="2" img-src="../../assets/media/news/mobile/m2.jpg">
        <div class="q-mt-md text-center" style="color: white">
          <h5 style="margin: -20px; font-weight: 600">Мы подключились
            к первому университету</h5>
          <h3 style="font-weight: 900"><b>ВГТУ</b></h3>
          <h5 style="margin: -20px; font-weight: 600">Воронежский государственный
            технический университет</h5>
        </div>
      </q-carousel-slide>
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
