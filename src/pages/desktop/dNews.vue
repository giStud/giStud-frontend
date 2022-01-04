<template>
  <q-page>
    <q-card id="MAIN-PAGE-NEWS" class="bg-none fix-ma" flat square>
      <q-card id="NEWS-CONTAINER-NEWS" class="center-all container-base bg-none row justify-center" flat>
        <q-card id="NEWS-PROJECT-NEWS" class="bg-none q-ma-none q-pa-none fix-mr">
          <q-card v-for="itemNews in currentPage.content" :key="itemNews.newsId" class="q-pa-none fix-pa fix-mb cursor-pointer" style="border-radius: 3px" @click="openNewsReadDialog(itemNews)">
            <q-card-section class="q-pa-none">
              <span class="text-h6 q-pb-sm">{{ itemNews.title }}</span><br>
              <span class="text-caption" v-html="itemNews.shortText"></span><br><br>
              <span class="text-caption cursor-pointer" @click="openNewsReadDialog(itemNews)">Читать подробнее...</span>
            </q-card-section>
            <q-card-section v-if="itemNews.imgSrc" class="q-pa-none fix-mt" style="text-align: center">
              <q-img :src="itemNews.imgSrc" />
            </q-card-section>
          </q-card>
          <q-card flat class="bg-none">
            <q-btn @click="pageNumber--" :disable="!currentPage">Предыдущая страница</q-btn>
            <q-btn @click="pageNumber++" :disable="!currentPage">Следующая страница</q-btn>
          </q-card>
        </q-card>
        <q-card id="NEWS-STUDENTS-NEWS" :style="'height:' + (31 + 11 + 31 * (newsTypes.length + 1)) + 'px'" class="q-ma-none q-pa-none fix-pa">
          <q-list class="q-py-none" padding>
            <q-item v-ripple :active="selectedNewsType === allTypeObj" :active-class="theme('active-list active-list-l', 'active-list active-list-d')" class="select-type-news" clickable @click="selectedNewsType = allTypeObj">
              <q-item-section>{{ allTypeObj.type }}</q-item-section>
            </q-item>
            <q-separator v-if="id === 0" style="margin: 5px 0" />
            <template v-for="(type, id) in newsTypes" :key="type.newsTypeId">
              <q-item v-ripple :active="selectedNewsType === type" :active-class="theme('active-list active-list-l', 'active-list active-list-d')" class="select-type-news" clickable @click="selectedNewsType = type">
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
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
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
    const allTypeObj = {newsTypeId: -1, type: 'Все', iconName: 'apps'};
    const selectedNewsType = ref(allTypeObj);
    const pageNumber = ref(0);
    const newsTypes = computed(() => store.getters['news/getNewsTypes']);
    const currentPage = computed( () => {
      const map = store.state.news.news;
      return map.get(pageNumber.value);
    });
    const newsTitle = ref("");
    const newsText = ref("");
    const newsDialog = ref(false);
    const src = ref("");
    const img = ref("");

    const checkerMouse = ref(false);


    const openNewsReadDialog = (news) => {
      newsDialog.value = true;
      newsTitle.value = news.title;
      newsText.value = news.fullText;
      src.value = news.source;
      img.value = news.imgSrc;
    };

    watch(pageNumber, async (newVal) => {
      const map = store.getters['news/getNewsMap'];
      const values = map.get(newVal);
      if (!values) {
        const typeId = getNewsTypeId();
        await store.dispatch('news/loadNewsPage', {pageNumber: newVal, typeId});
      }
    })

    const getNewsTypeId = () => {
      if (selectedNewsType.value.type !== 'Все') {
        return selectedNewsType.value.newsTypeId;
      } else {
        return null;
      }
    }

    watch(selectedNewsType, async (val) => {
      store.commit('news/clearNewsMap')
      if (val.type === 'Все') {
        await store.dispatch('news/loadNewsPage', {pageNumber : pageNumber.value})
      } else {
        await store.dispatch('news/loadNewsPage', {pageNumber : pageNumber.value, sectionId : val.newsTypeId})
      }
      pageNumber.value = 0;
    })


    onMounted(async () => {
      await store.dispatch('news/loadNewsPage', {pageNumber: pageNumber.value});
      await store.dispatch('news/getNewsTypes');
      console.log(currentPage.value)

      const newsId = props.newsId;
      if (props.newsId !== null) {
        const selectedNewsItem = await NewsService.getNewsItemById(newsId);
        openNewsReadDialog(selectedNewsItem);
      }
    });

    onBeforeUnmount(()=> {
      store.commit('news/clearNewsMap');
    })
    return {
      currentPage,
      allTypeObj,
      newsTypes,
      pageNumber,
      selectedNewsType,
      newsDialog,
      newsTitle,
      newsText,
      src,
      openNewsReadDialog,
      customClass,
      goUrl,
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
