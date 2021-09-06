<template>
  <q-page>
    <div id="top-adw" class="main-row q-mt-md" :style="customStyle('min-width: 1250px', '')">
      <q-card square flat class="bg-none">
        <q-card-section class="q-px-none">
          <div id="yandex_rtb_R-A-1273406-4"></div>
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
                  <q-img height="250px" :src="itemNews.imgSrc"/>
                  <!--                  <q-skeleton square height="250px"/>-->
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
                <q-btn @click="getNews(itemNews.title, itemNews.fullText, itemNews.source)" flat id="btn-read">Читать</q-btn>
                <div>
                  <q-icon size="16px" color="black" name="event"/>
                  <span class="q-pl-sm"> {{ getDateString(new Date(itemNews.date)) }}</span>
                </div>
              </q-card-actions>
              <div class="news-p bg-none"></div>
            </q-card>
          </q-card>
        </template>
      </div>

      <q-dialog v-model="newsDialog" square>
        <q-card style="max-width: 657px">
          <q-card-section style="color: white" class="row bg-primary">
            <div :class="customClass('text-h6', 'text-h6')"> Источник:</div>
            <q-btn class="q-ma-sm " :style="customStyle('font-size: 8px','font-size: 8px')" icon="fas fa-external-link-alt" @click="goUrl(src)" flat round dense />
            <q-space />

            <q-btn :style="customStyle('','font-size: 10px')" icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <div class="text-h6">{{ newsTitle }}</div>
          </q-card-section>
          <q-separator/>
          <q-card-section v-html="newsText" style="max-height: 50vh" class="scroll"></q-card-section>
        </q-card>
      </q-dialog>

      <div class="col-3 q-pl-sm bg-none mobile-hide">
        <q-card square flat class="bg-none">
          <q-card class="bg-none">
            <q-card-section>
              <div id="yandex_rtb_R-A-1273406-5"></div>
            </q-card-section>
          </q-card>
        </q-card>
      </div>
      <div>
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item
            clickable
            v-ripple
            :active="newsMenuValue === 'all'"
            @click="newsMenuValue = 'all'"
            active-class="color: white;   background:  #1976D2;"
          >
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>Все</q-item-section>
          </q-item>

          <template v-for="type in newsTypesOptions" :key="type.newsTypeId">
            <q-item
              clickable
              v-ripple
              :active="newsMenuValue === type"
              @click="newsMenuValue = type"
              active-class="color: white;   background:  #1976D2;"
            >
              <q-item-section avatar>
                <q-icon name="inbox" />
<!--                <q-icon :name="type.icon" />-->
              </q-item-section>

              <q-item-section>{{type.type}}</q-item-section>
            </q-item>
          </template>

        </q-list>
      </div>
    </div>
    <div>
      <q-btn @click="loadNextPage">Загрузить ещё</q-btn>
    </div>

  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue'
import NewsService from '../services/news/newsService.js'
import {getDateString} from "src/composables/schedule/ScheduleTable";

import {customClass, customStyle} from "src/services/other/tools";
import {useMeta} from "quasar";

const meta = {
  title: 'Расписание - GISTUD',
  script: {
    yandexMetrika: {
      type: 'application/javascript',
      innerHTML: `window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-4', blockId: 'R-A-1273406-4'})});
                  window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-5', blockId: 'R-A-1273406-5'})})
    `
    }
  },
  meta: {
    description: {
      name: 'description',
      content: 'Лента новостей - GISTUD | Удобная информация вашего университета: студенческие новости, расписание и многое другое'
    },
    keywords: {
      name: 'keywords',
      content: 'расписание, информационный сервис, студенты, студенческий сервис, вуз, университет, РФ, Россия, gistud'
    },
  }
}

export default {
  name: 'News',

  setup() {
    useMeta(() => meta);
    const store = useStore();
    const news = ref([]);
    const newsTitle = ref("");
    const newsText = ref("");
    const newsDialog = ref(false);
    const src = ref("");
    const newsMenuValue = ref('all');
    const newsTypesOptions = ref([]);

    onMounted(async () => {
      store.commit('news/clearNews')
      await store.dispatch('news/getNewsPage', {existingNews : []})
      await store.dispatch('news/getNewsTypes')
      newsTypesOptions.value = store.getters['news/getNewsTypes'];
      news.value = store.getters['news/getNews'];
    });

    const getNews = (title, text, sources) => {
      newsDialog.value = true;
      newsTitle.value = title;
      newsText.value = text;
      src.value = sources;
    };

    watch(newsMenuValue, async (val) => {
      if (val !== null) {
        store.commit('news/clearNews')
        if (val === 'all') {
          await store.dispatch('news/getNewsPage', {existingNews : []})
        } else {
          await store.dispatch('news/getNewsPageByType', {existingNews : [], typeId : val.newsTypeId})
        }
      }
    });

    const loadNextPage = async () => {
      let idsOfExistingsNews = [];
      for (let item of news.value) {
        idsOfExistingsNews.push(item.newsId);
      }
      if (newsMenuValue.value === 'all') {
        await store.dispatch('news/getNewsPage', {existingNews : idsOfExistingsNews});
      } else {
        await store.dispatch('news/getNewsPageByType', {existingNews : idsOfExistingsNews, typeId : newsMenuValue.value.newsTypeId})
      }

    }

    return {
      news,
      getDateString,
      newsDialog,
      newsTitle,
      newsText,
      src,
      newsMenuValue,
      newsTypesOptions,
      getNews,
      customStyle,
      customClass,
      goUrl,
      loadNextPage,
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
