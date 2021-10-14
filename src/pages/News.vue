<template>
  <q-page>
    <q-card id="MAIN-PAGE-NEWS" class="bg-none fix-ma" flat square>

      <q-card id="NEWS-CONTAINER-NEWS" class="center-all container-base bg-none row justify-center" flat>
        <q-card id="NEWS-PROJECT-NEWS" class="bg-none q-ma-none q-pa-none fix-mr">

          <q-card v-for="itemNews in news" :key="itemNews.newsId" class="q-pa-none fix-pa fix-mb" style="border-radius: 3px">
            <q-card-section class="q-pa-none">
              <span class="text-h6 q-pb-sm">{{ itemNews.title }}</span><br>
              <span class="text-caption" v-html="itemNews.shortText"></span><br>
              <span @click="getNews(itemNews)">Читать подробнее...</span>
            </q-card-section>
            <q-card-section class="q-pa-none fix-mt" style="text-align: center">
              <q-img :src="itemNews.imgSrc" />
            </q-card-section>
          </q-card>


        </q-card>
        <q-card id="NEWS-STUDENTS-NEWS" :style="'height:' + (31 + 11 + 31 * newsTypesOptions.length) + 'px'" class="q-ma-none q-pa-none fix-pa">
          <q-list class="q-py-none" padding>
            <template v-for="(type, id) in newsTypesOptions" :key="type.newsTypeId">
              <q-item v-ripple :active="newsTypeValue === type" :active-class="theme('active-list active-list-l', 'active-list active-list-d')" class="select-type-news" clickable @click="newsTypeValue = type">
                <q-item-section>{{ type.type }}</q-item-section>
              </q-item>
              <q-separator v-if="id === 0" style="margin: 5px 0" />
            </template>
          </q-list>
        </q-card>
      </q-card>
    </q-card>

    <!--    <div id="top-adw" :style="customStyle('min-width: 1250px', '')" class="main-row q-mt-md">-->
    <!--      <q-card class="bg-none" flat square>-->
    <!--      </q-card>-->
    <!--    </div>-->
    <!--    <div :class="customClass('row main-row', '')" :style="customStyle('min-width: 1250px', '')">-->
    <!--      <div :class="customClass('col-9 q-pr-sm', '')" class="bg-none">-->
    <!--        <template v-for="itemNews in news" :key="itemNews.newsId">-->
    <!--          <q-card :class="customClass('', 'q-mx-sm')" flat square>-->
    <!--            <q-card>-->
    <!--              <q-card-section class="mobile-hide" horizontal>-->
    <!--                <q-card-section class="col-6 q-pt-xs">-->
    <!--                  <div class="text-h5 q-mt-sm q-mb-xs">-->

    <!--                  </div>-->
    <!--                  <div>-->
    <!--                  </div>-->
    <!--                </q-card-section>-->
    <!--                <q-card-section class="col-6">-->
    <!--                  <q-img :src="itemNews.imgSrc" height="250px" />-->
    <!--                  &lt;!&ndash;                  <q-skeleton square height="250px"/>&ndash;&gt;-->
    <!--                </q-card-section>-->
    <!--              </q-card-section>-->

    <!--              <q-separator />-->
    <!--              <q-card-actions class="justify-between">-->
    <!--                <q-btn id="btn-read" flat @click="getNews(itemNews.title, itemNews.fullText, itemNews.source)">Читать-->
    <!--                </q-btn>-->
    <!--                <div>-->
    <!--                  <q-icon color="black" name="event" size="16px" />-->
    <!--                  <span class="q-pl-sm"> {{ getDateString(new Date(itemNews.date)) }}</span>-->
    <!--                </div>-->
    <!--              </q-card-actions>-->
    <!--              <div class="news-p bg-none"></div>-->
    <!--            </q-card>-->
    <!--          </q-card>-->
    <!--        </template>-->
    <!--      </div>-->

    <q-dialog v-model="newsDialog" class="q-pa-none" transition-show="0" transition-hide="0" maximized >
      <q-card class="q-pa-none fix-pa row no-wrap justify-center" style="background: rgba(0,0,0,0.5)">
        <q-card @mouseenter="aaaa = false" class="bg-none" style="width: 100%" v-close-popup ></q-card>
        <q-card class="scroll" @mouseenter="aaaa = false" style="max-width: 657px; border-radius: 3px; position: relative">
          <q-card-section class="row items-center bg-primary q-pa-none fix-px" style="color: white;">
            <span> Источник:</span>
            <q-btn class="q-ma-sm " flat icon="fas fa-external-link-alt" round style="height: 8px; font-size: 8px" @click="goUrl(src)" />
            <q-space />
          </q-card-section>
          <q-card-section style="text-align: center">
            <span style="font-size: 16px;">{{ newsTitle }}</span>
          </q-card-section>
          <q-separator style="margin: 0 50px" />
          <q-card-section v-html="newsText"/>
          <q-card-section>
            <q-img :src="img"/>
          </q-card-section>
        </q-card>
        <q-card @mouseenter="aaaa = true" class="bg-none" style="width: 100%;" v-close-popup >
          <q-icon :color="aaaa?'white':''"  name="close" id="close-bt-dialog" size="lg" v-close-popup style="margin-left: 15px;color: rgba(255,255,255,0.5)" />
        </q-card>
      </q-card>
    </q-dialog>

    <!--      <div class="col-3 q-pt-none q-px-sm bg-none mobile-hide">-->
    <!--        <q-card flat square>-->
    <!--          <div>-->

    <!--          </div>-->

    <!--          <q-card class="bg-none">-->
    <!--            <q-card-section>-->
    <!--              <div id="yandex_rtb_R-A-1273406-5"></div>-->
    <!--            </q-card-section>-->
    <!--          </q-card>-->
    <!--        </q-card>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    &lt;!&ndash;    <div class="q-px-lg q-py-sm">&ndash;&gt;-->
    <!--    &lt;!&ndash;      <q-btn flat @click="loadNextPage">Загрузить ещё</q-btn>&ndash;&gt;-->
    <!--    &lt;!&ndash;    </div>&ndash;&gt;-->
    <!--    <div class="q-px-lg" style="text-align: left; margin-bottom: 30px; margin-top: 15px;">-->
    <!--      <q-chip v-if="visibleLoadBtn && (news.length % 5 === 0) && (news.length !== 0)" clickable color="primary" icon-right="arrow_drop_down" outline square text-color="white" @click="loadNextPage">-->
    <!--        Загрузить ещё-->
    <!--      </q-chip>-->
    <!--    </div>-->

  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue'
import NewsService from '../services/news/newsService.js'
import {getDateString} from "src/composables/schedule/ScheduleTable";
import {useStore} from "vuex";
import {customClass, customStyle, goUrl, theme} from "src/services/other/tools";
import {debounce, useMeta} from "quasar";

const meta = {
  title: 'Новости - GISTUD',
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

  props: {
    newsId: {
      type: String,
      default: null
    }
  },

  setup(props) {
    useMeta(() => meta);
    const store = useStore();
    const news = ref([]);
    const newsTitle = ref("");
    const newsText = ref("");
    const newsDialog = ref(false);
    const src = ref("");
    const allTypeObj = {newsTypeId: -1, type: 'Все', iconName: 'apps'}
    const newsTypeValue = ref(allTypeObj);
    const newsTypesOptions = ref([]);
    const img = ref("");

    const visibleLoadBtn = ref(true);

    const aaaa = ref(false);


    const getNews = (news) => {
      newsDialog.value = true;
      newsTitle.value = news.title;
      newsText.value = news.fullText;
      src.value = news.source;
      img.value = news.imgSrc;
    };

    const loadNextPage = async () => {
      let idsOfExistingsNews = [];
      let data;
      for (let item of news.value) {
        idsOfExistingsNews.push(item.newsId);
      }
      if (newsTypeValue.value.type === 'Все') {
        data = await store.dispatch('news/getNewsPage', {
          existingNews: idsOfExistingsNews
        });
      } else {
        data = await store.dispatch('news/getNewsPageByType', {
          existingNews: idsOfExistingsNews,
          typeId: newsTypeValue.value.newsTypeId
        })
      }
      visibleLoadBtn.value = !(data && data.length <= 0);
    }

    const filterByNewsType = async (type) => {
      visibleLoadBtn.value = true;
      if (type) {
        store.commit('news/clearNews')
        if (type.type === 'Все') {
          await store.dispatch('news/getNewsPage', {existingNews: []})
        } else {
          await store.dispatch('news/getNewsPageByType', {existingNews: [], typeId: type.newsTypeId})
        }
      }
    }

    watch(newsTypeValue, filterByNewsType);

    onMounted(async () => {
      store.commit('news/clearNews')
      await store.dispatch('news/getNewsPage', {existingNews: []})
      await store.dispatch('news/getNewsTypes')
      newsTypesOptions.value[0] = allTypeObj;
      newsTypesOptions.value.push.apply(newsTypesOptions.value, store.getters['news/getNewsTypes']);
      news.value = store.getters['news/getNews'];

      const newsId = props.newsId;
      if (props.newsId !== null) {
        const selectedNewsItem = await NewsService.getNewsItemById(newsId);
        getNews(selectedNewsItem);
      }
    });

    return {
      news,
      newsDialog,
      newsTitle,
      newsText,
      src,
      newsTypeValue,
      newsTypesOptions,
      visibleLoadBtn,
      getNews,
      customStyle,
      customClass,
      loadNextPage,
      goUrl,
      getDateString,
      theme,
      aaaa, img
    }
  }
}
</script>

<style lang="css">
@import 'src/css/main.css';

.bg-none {
  background: none;
}

#NEWS-PROJECT-NEWS {
  width: 645px;
  border-radius: 4px;
}

#NEWS-STUDENTS-NEWS {
  width: 230px;
  border-radius: 4px;
}

.select-type-news {
  min-height: 10px;
  margin: 0 -15px;
  padding: 5px 5px 5px 25px;
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

.active-list {
  color: black;
  padding-left: 15px;
}

.active-list-d {
  background: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #9a9a9a;
  color: white;
}

.active-list-l {
  background: rgb(242, 243, 245);
  border-left: 3px solid dodgerblue;
}

#close-bt-dialog:hover {
  color: red;
}

.scroll-hidden {
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}

</style>
