<template>
  <q-page>
    <div id="top-adw" class="main-row q-mt-md" :style="customStyle('min-width: 1250px', '')">
      <q-card square flat class="bg-none border">
        <q-card-section class="q-px-none">
          <!--Реклама-->
        </q-card-section>
      </q-card>

    </div>

    <div class="row main-row" :style="customStyle('min-width: 1250px', '')">
      <div :class="customClass('col-9 q-pr-sm', '')" class="bg-none">
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
<!--                  <q-img height="250px" :src="itemNews.imgSrc"/>-->
                  <q-skeleton square height="250px"/>
                </q-card-section>
              </q-card-section>
              <!--MOBILE-->
              <q-card-section class="q-pt-xs desktop-hide">
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
                <q-btn @click="getNews(itemNews.title, itemNews.fullText)" flat id="btn-read">Читать</q-btn>
                <div>
                  <q-icon size="16px" color="black" name="event"/>
                  <span class="q-pl-sm"> {{getDateString(new Date(itemNews.date))}}</span>
                </div>
              </q-card-actions>
              <div class="news-p bg-none"></div>
            </q-card>
          </q-card>
        </template>
      </div>

      <q-dialog v-model="newsDialog" square >
        <q-card style="max-width: 657px">
          <q-card-section style="color: white" class="row bg-primary">
            <q-btn icon="feed" flat round dense/>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <div class="text-h6"> {{ newsTitle }}</div>
          </q-card-section>
          <q-card-section v-html="newsText" style="max-height: 50vh" class="scroll"></q-card-section>
        </q-card>
      </q-dialog>

      <div class="col-3 q-pl-sm bg-none mobile-hide">
        <q-card square flat class="bg-none border">
          <q-card class="bg-none">
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
import { useQuasar } from 'quasar'

export default {
  name: 'News',


  setup() {
    const $q = useQuasar();
    const news = ref([]);
    const newsTitle = ref("");
    const newsText = ref("");
    const newsDialog = ref(false);
    onMounted(async () => {
      news.value = await NewsService.getNews();
    });
    const getNews = (title, text) => {
      newsDialog.value = true;
      newsTitle.value = title;
      newsText.value = text;
    };

    const customStyle = (desktop, mobile) => {

      let styleValid = ''
      if ($q.platform.is.desktop) {

        styleValid += desktop;
      }
      if ($q.platform.is.mobile) {
        styleValid += mobile;
      }
      console.log(styleValid);
      return styleValid;
    }

    const customClass = (desktop, mobile) => {

      let styleValid = ''
      if ($q.platform.is.desktop) {

        styleValid += desktop;
      }
      if ($q.platform.is.mobile) {
        styleValid += mobile;
      }
      console.log(styleValid);
      return styleValid;
    }

    return {
      news,
      getDateString,
      newsDialog,
      newsTitle,
      newsText,
      getNews,
      customStyle,
      customClass,
    }
  }
}
</script>

<style scoped>
.bg-none {
  background-color: rgb(238, 238, 238);
}
.news-p {
  padding-top: 16px;
}
.border {
  border: 1px solid black;
}

#top-adw {
  margin-bottom: 16px;
}
.main-row {
  padding-right: 24px;
  padding-left: 24px;

}
#main-center-row {

}
</style>
