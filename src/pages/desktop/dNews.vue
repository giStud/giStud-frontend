<template>
  <q-page>
    <q-card id="MAIN-PAGE-NEWS" class="bg-none fix-ma" flat square>
      <q-card id="NEWS-CONTAINER-NEWS" class="center-all container-base bg-none row justify-center" flat>
        <q-card id="NEWS-PROJECT-NEWS" class="bg-none q-ma-none q-pa-none fix-mr">
          <q-card v-for="itemNews in news" :key="itemNews.newsId" class="q-pa-none fix-pa fix-mb cursor-pointer" style="border-radius: 3px" @click="getNews(itemNews)">
            <q-card-section class="q-pa-none">
              <span class="text-h6 q-pb-sm">{{ itemNews.title }}</span><br>
              <span class="text-caption" v-html="itemNews.shortText"></span><br><br>
              <span class="text-caption cursor-pointer" @click="getNews(itemNews)">Читать подробнее...</span>
            </q-card-section>
            <q-card-section class="q-pa-none fix-mt" style="text-align: center">
              <q-img :src="itemNews.imgSrc" />
            </q-card-section>
          </q-card>
          <q-card flat class="bg-none">
            <q-chip v-if="visibleLoadBtn && (news.length % 5 === 0) && (news.length !== 0)" clickable icon-right="arrow_drop_down" outline @click="loadNextPage">
              Загрузить ещё
            </q-chip>
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
    <q-dialog v-model="newsDialog" class="q-pa-none" transition-show="0" transition-hide="0" maximized >
      <q-card class="q-pa-none fix-pa row no-wrap justify-center" style="background: rgba(0,0,0,0.5)">
        <q-card @mouseenter="checkerMouse = false" class="bg-none" style="width: 100%" v-close-popup ></q-card>
        <q-card class="scroll-hidden" @mouseenter="checkerMouse = false" style="min-width: 640px; max-width: 657px; position: relative">
          <q-card-section class="row items-center bg-primary q-pa-none fix-px" style="color: white;">
            <span> Источник:</span>
            <q-btn class="q-ma-sm " flat icon="fas fa-external-link-alt" round style="height: 8px; font-size: 8px" @click="goUrl(src)" />
            <q-space/>
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
        <q-card @mouseenter="checkerMouse = true" class="bg-none cursor-pointer" style="width: 100%;" v-close-popup >
          <q-icon :color="checkerMouse?'white':''"  name="close" id="close-bt-dialog" size="lg" v-close-popup style="margin-left: 15px;color: rgba(255,255,255,0.5)" />
        </q-card>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue'
import NewsService from '../../services/news/newsService.js'
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

    const checkerMouse = ref(false);


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
      checkerMouse, img
    }
  }
}
</script>

<style lang="css">
@import '../../css/main.css';

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
