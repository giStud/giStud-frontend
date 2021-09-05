<template>
  <q-page>
    <div id="top-adw" class="main-row q-mt-md">
      <q-card square flat class="bg-none border">
        <q-card-section class="q-px-none">
          <!--Реклама-->
        </q-card-section>
      </q-card>

    </div>

    <div class="row main-row">
      <div  class="col-9 q-pr-sm bg-none">
        <template v-for="itemNews in news" :key="itemNews.newsId">
          <q-card square flat>
            <q-card>
              <q-card-section horizontal class="mobile-hide">
                <q-card-section class="col-6 q-pt-xs">
                  <div class="text-h5 q-mt-sm q-mb-xs">
                    {{ itemNews.title }}
                  </div>
                  <div v-html="itemNews.shortText" class="text-caption text-grey">
                  </div>
                </q-card-section>
                <q-card-section class="col-6">
                  <q-img height="250px" :src="itemNews.imgSrc"/>
                </q-card-section>
              </q-card-section>
              <!--MOBILE-->
              <q-card-section class="q-pt-xs">
                <div class="text-h5 q-mt-sm q-mb-xs">
                  {{ itemNews.title }}
                </div>
                <div v-html="itemNews.shortText" class="text-caption text-grey">
                </div>
              </q-card-section>
              <q-card-section class="desktop-hide">
                <q-img height="250px" :src="itemNews.imgSrc"/>
              </q-card-section>
              <q-separator/>
              <q-card-actions class="justify-between">
                <q-btn flat color="primary">Читать</q-btn>
                <div>
                  <q-icon color="black" name="event"/>
                  <span> {{getDateString(new Date(itemNews.date))}}</span>
                </div>
              </q-card-actions>
              <div class="news-p bg-none"></div>
            </q-card>
          </q-card>
        </template>
      </div>

      <div class="col-3 q-pl-sm bg-none mobile-hide">
        <q-card square flat>
          <q-card class="border">
            <q-card-section>
              <!--Реклама-->
            </q-card-section>
          </q-card>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
import {computed, onMounted, ref} from 'vue'
import NewsService from '../services/other/newsService.js'
import {getDateString} from "src/composables/schedule/ScheduleTable";

export default {
  name: 'News',


  setup() {
    const news = ref([]);
    onMounted(async () => {
      news.value = await NewsService.getNews();
    });

    return {
      news,
      getDateString
    }
  }
}
</script>

<style lang="css">
@import 'src/css/news.css';
</style>
