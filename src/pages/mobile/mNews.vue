<template>
  <q-page class="body-color">
    <q-card flat>
      <q-card flat style="max-height: 81px;" square>
        <q-card-section :class="theme('color-l', 'color-d')" id="title-page" class="q-ma-none">Студенческие новости</q-card-section>
        <q-card-section class="q-pa-none" id="top-nav-div">
          <q-tabs id="asdasdasd" v-model="newsTabPanel" dense class="text-grey" :active-color="theme('primary', '#d0d0d0')"
                  :indicator-color="theme('primary', '#d0d0d0')"
                  align="justify"
                  narrow-indicator inline-label>
            <template v-for="type in newsTypesOptions" :key="type.newsTypeId">
              <q-tab :class="theme('color-l', 'color-d')" swipable class="q-px-sm top-nav tab-btn" no-caps flat :name="type.type" @click="newsTypeValue = type">
                {{ type.type }}
              </q-tab>
            </template>
          </q-tabs>
        </q-card-section>
        <q-separator />
        <q-card square flat :class="theme('bg-none-l', 'bg-none-d')" class="q-mt-sm">
            <template v-for="itemNews in news" :key="itemNews">
              <q-card square flat class="q-mb-sm">
                <q-separator />
                <q-card-section>
                  <p :class="theme('text-black', 'text-white')" style="font-size: 15px; margin: 0 0 10px 0; font-weight: bold" class="text-justify">{{ itemNews.title }}</p>
                  <div class="text-justify alodaun" v-html="itemNews.shortText" :style="theme('', 'color: white')" style="margin: 0;"/>
                  <a :class="theme('text-primary', 'text-grey')" style="transform: none" type="a" @click="getNews(itemNews.title, itemNews.fullText, itemNews.source)">
                    Открыть полностью...
                  </a>
                </q-card-section>
                <q-card-section class="q-pt-none q-px-none">
                  <q-img :src="itemNews.imgSrc" />
                </q-card-section>
                <q-separator />
              </q-card>
            </template>
        </q-card>
        <div class="q-px-lg q-py-sm">
          <q-btn v-if="(news.length % 5 === 0) && (news.length !== 0)" flat @click="loadNextPage">Загрузить ещё</q-btn>
        </div>

        <div style="height: 40px;"></div>

        <q-dialog maximized square v-model="newsDialog" transition-show="slide-left" transition-hide="slide-right">
          <q-card flat>
            <q-card-section class="row q-pa-none q-ma-none justify-between">
              <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup />
              <q-btn size="10px" class="q-ma-sm " icon="fas fa-external-link-alt" @click="goUrl(newsSrc)" flat round dense />
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
import {customClass, goUrl, theme, debug} from "src/services/other/tools";
import {onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import texts from "src/info/texts";
import {useStore} from "vuex";
import NewsService from "src/services/news/newsService";

export default {
  name: "mNews",

  setup() {
    const $q = useQuasar();
    const store = useStore();
    const news = ref([]);
    const newsTitle = ref("");
    const newsText = ref("");
    const newsDialog = ref(false);
    const newsSrc = ref("");
    const allTypeObj = {newsTypeId: -1, type: 'Все', iconName: 'apps'}
    const newsTabPanel = ref(allTypeObj.type);
    const newsTypeValue = ref(allTypeObj);
    const newsTypesOptions = ref([]);
    const dialogModel = ref(false);
    const currentNewsTypeIndex = ref(0);

    const getNews = (title, text, sources) => {
      newsDialog.value = true;
      newsTitle.value = title;
      newsText.value = text;
      newsSrc.value = sources;
    };

    const loadNextPage = async () => {
      let idsOfExistingsNews = [];
      for (let item of news.value) {
        idsOfExistingsNews.push(item.newsId);
      }
      if (newsTypeValue.value.type === 'Все') {
        await store.dispatch('news/getNewsPage', {existingNews: idsOfExistingsNews});
      } else {
        await store.dispatch('news/getNewsPageByType', {
          existingNews: idsOfExistingsNews,
          typeId: newsTypeValue.value.newsTypeId
        })
      }
    }

    const filterByNewsType = async (type) => {
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
      store.commit('news/clearNews')
      await store.dispatch('news/getNewsPage', {existingNews: []})
      await store.dispatch('news/getNewsTypes')
      newsTypesOptions.value[0] = allTypeObj;
      newsTypesOptions.value.push.apply(newsTypesOptions.value, store.getters['news/getNewsTypes']);
      news.value = store.getters['news/getNews'];
      newsTypeValue.value = allTypeObj;
    });

    watch(newsTypeValue, filterByNewsType);

    return {
      newsTabPanel,
      texts,
      news,
      newsDialog,
      newsTitle,
      newsText,
      newsSrc,
      newsTypeValue,
      newsTypesOptions,
      dialogModel,
      currentNewsTypeIndex,
      scaleNewsTypeIndex,
      filterByNewsType,
      loadNextPage,
      getNews,
      goUrl,
      theme,
      debug
    }
  }
}
</script>
<style scoped>
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
.tab-btn:hover {
}
</style>
