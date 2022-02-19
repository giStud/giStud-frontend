<template>
  <q-page :class="theme('bg-none-l', 'bg-none-d')">
    <q-card flat>
      <q-card flat square style="max-height: 81px;">
        <q-card-section id="title-page" :class="theme('color-l', 'color-d')" class="q-ma-none">Студенческие новости
        </q-card-section>
        <q-card-section id="top-nav-div" class="q-pa-none">
          <q-tabs id="asdasdasd" v-model="newsTabPanel" :active-color="theme('primary', '#d0d0d0')" :indicator-color="theme('primary', '#d0d0d0')" align="justify"
                  class="text-grey"
                  dense
                  inline-label narrow-indicator>
            <q-tab :class="theme('color-l', 'color-d')" :name="'Все'" class="q-px-sm top-nav tab-btn" flat no-caps swipable @click="selectedNewsType = allTypeObj">
              Все
            </q-tab>
            <template v-for="type in newsTypes" :key="type.newsTypeId">
              <q-tab :class="theme('color-l', 'color-d')" :name="type.type" class="q-px-sm top-nav tab-btn" flat no-caps swipable @click="selectedNewsType = type">
                {{ type.type }}
              </q-tab>
            </template>
          </q-tabs>
        </q-card-section>
        <q-separator v-if="!Dark.isActive"/>
        <q-card :class="theme('bg-none-l', 'bg-none-d')" class="q-mt-sm" flat square>
          <template v-for="itemNews in news" :key="itemNews">
            <q-card class="q-mb-sm cursor-pointer" flat square @click="openNewsReadDialog(itemNews)">
              <q-separator v-if="!Dark.isActive"/>
              <q-card-section>
                <p :class="theme('text-black', 'text-white')" class="text-justify" style="font-size: 15px; margin: 0 0 10px 0; font-weight: bold">
                  {{ itemNews.title }}</p>
                <div :style="theme('', 'color: white')" class="text-justify alodaun" style="margin: 0;" v-html="itemNews.shortText" />
                <a :class="theme('text-primary', 'text-grey')" style="transform: none" type="a">
                  Открыть полностью...
                </a>
              </q-card-section>
              <q-card-section class="q-pt-none q-px-none">
                <q-img :src="itemNews.imgSrc" />
              </q-card-section>
              <q-separator v-if="!Dark.isActive"/>
            </q-card>
          </template>
        </q-card>
        <div class="justify-between" >
          <q-card flat class="bg-none row justify-between" :class="theme('bg-none-l', 'bg-none')" style="margin-bottom: 30px; margin-top: 15px; background: none">
            <q-btn
              :class="theme('btn-selected-schedule-l', 'btn-selected-schedule-d')"
              class="btn-select-schedule" icon="west" no-caps
              :color="theme('primary', 'white')"
              outline rounded style="width: 60px; margin-left: 15px" @click="pageNumber--" :disable="currentPage ? currentPage.first : true"/>
            <q-btn
              :class="theme('btn-selected-schedule-l', 'btn-selected-schedule-d')"
              class="btn-select-schedule q-mx-sm" icon="east" no-caps
              :color="theme('primary', 'white')"
              outline rounded style="width: 60px; margin-right: 15px"  @click="pageNumber++" :disable="currentPage ? currentPage.last : true"/>
          </q-card>
        </div>

        <div style="height: 40px;"></div>

        <q-dialog v-model="newsDialog" maximized square transition-hide="slide-right" transition-show="slide-left">
          <q-card flat>
            <q-card-section class="row q-pa-none q-ma-none justify-between">
              <q-btn v-close-popup dense flat icon="arrow_back" round style="width: 48px;" />
              <q-btn class="q-ma-sm " dense flat icon="fas fa-external-link-alt" round size="10px" @click="goUrl(newsSrc)" />
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pb-none text-justify" style="font-weight: bold; font-size: 14px">
              {{ newsTitle }}
            </q-card-section>
            <q-card-section class="q-pt-sm text-justify" v-html="newsText">

            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card>
    </q-card>

  </q-page>
</template>

<script>
import {customClass, debug, goUrl, theme} from "src/services/other/tools";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {Dark, useMeta, useQuasar} from "quasar";
import texts from "src/info/texts";
import {useStore} from "vuex";
import NewsService from "src/services/news/newsService";

export default {
  name: "mNews",

  setup() {
    const store = useStore();
    const allTypeObj = {newsTypeId: -1, type: 'Все', iconName: 'apps'};
    const selectedNewsType = ref(allTypeObj);
    const pageNumber = ref(0);
    const newsTypes = computed(() => store.getters['news/getNewsTypes']);
    const currentPage = computed( () => {
      const map = store.state.news.news;
      return map.get(pageNumber.value);
    });
    const news = computed(()=> {
      if (currentPage.value) {
        return currentPage.value.content;
      } else {
        return [];
      }
    })
    const newsTitle = ref("");
    const newsText = ref("");
    const newsDialog = ref(false);
    const newsSrc = ref("");
    const newsTabPanel = ref(allTypeObj.type);

    const openNewsReadDialog = (news) => {
      newsDialog.value = true;
      newsTitle.value = news.title;
      newsText.value = news.fullText;
      newsSrc.value = news.source;
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
      if (pageNumber.value === 0) {
        if (val.type === 'Все') {
          await store.dispatch('news/loadNewsPage', {pageNumber : pageNumber.value})
        } else {
          await store.dispatch('news/loadNewsPage', {pageNumber : pageNumber.value, typeId : val.newsTypeId})
        }
      } else {
        pageNumber.value = 0;
      }
    })


    onMounted(async () => {
      store.commit('globalState/changeCurrentPage','news');
      await store.dispatch('news/loadNewsPage', {pageNumber: pageNumber.value});
      await store.dispatch('news/getNewsTypes');
    });

    onBeforeUnmount(()=> {
      store.commit('news/clearNewsMap');
    })

    /*
      const newsTypeValue = ref(allTypeObj);
      const newsTypesOptions = ref([]);
      const currentNewsTypeIndex = ref(0);
      const visibleLoadBtn = ref(true);

      const getNews = (newsObject) => {
        newsDialog.value = true;
        newsTitle.value = newsObject.title;
        newsText.value = newsObject.fullText;
        newsSrc.value = newsObject.source;
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

    const scaleNewsTypeIndex = (val) => {
      if (newsTypesOptions.value.length !== 0) {
        let size = newsTypesOptions.value.length - 1;
        let newVal = currentNewsTypeIndex.value + val;
        if (newVal > size) {
          newVal = size;
        }
        if (newVal < 0) {
          newVal = 0;
        }
        currentNewsTypeIndex.value = newVal;
      }
    }

    watch(currentNewsTypeIndex, (newVal) => {
      newsTypeValue.value = newsTypesOptions[newVal];
    })

    onMounted(async () => {
      store.commit('globalState/changeCurrentPage','news');
      store.commit('news/clearNews')
      await store.dispatch('news/getNewsPage', {existingNews: []})
      await store.dispatch('news/getNewsTypes')
      newsTypesOptions.value[0] = allTypeObj;
      newsTypesOptions.value.push.apply(newsTypesOptions.value, store.getters['news/getNewsTypes']);
      news.value = store.getters['news/getNews'];
      newsTypeValue.value = allTypeObj;
    });

    watch(newsTypeValue, filterByNewsType);*/

    return {
      currentPage,
      allTypeObj,
      pageNumber,
      selectedNewsType,
      newsSrc,
      newsTabPanel,
      news,
      newsDialog,
      newsTitle,
      newsText,
      newsTypes,
      openNewsReadDialog,
      customClass,
      goUrl,
      theme,
      debug,
      Dark,
    }
  }
}
</script>
<style scoped>
.btn-select-schedule {
  border-radius: 20px;
}

.btn-selected-schedule-l {
  background: #f0f2f5;
}

.btn-selected-schedule-d {
  background: #4a4f57;
}

.alodaun span {
  color: white;
}

.bg-none-l {
  background-color: rgb(238, 238, 238);
}

.bg-none-d {
  background-color: #2f3136;
}

.body-color {
  background-color: #edeef0;
  /*background-color: #0047d4;*/
}

#asdasdasd {
  color: #1976D2;
}

#title-page {
  font-size: 18px;
  padding: 14px 15px;
}

#top-nav-div {
  width: auto;
  height: 25px;
  font-size: 10px;
  color: gray;
}

.top-nav {
  width: auto;
  height: 25px;
  font-size: 11px;
  color: gray;
}

.tab-btn {
  font-size: 10px;
}

.color-d {
  color: #d0d0d0;
}

.color-l {
  color: gray;
}

.btn-load-last-l:hover {
  color: #1976D2;
}

.btn-load-last-b:hover {
  color: white;
}

.tab-btn:hover {
}
</style>
