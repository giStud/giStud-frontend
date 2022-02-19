<template>
  <div>
    <q-list>
      <q-item-label class="q-pa-none" id="header-news" style="; text-align: center" header>
        <span :style="theme('color: #1976D2','color: #fff')">Последние новости</span>
        <q-separator class="q-my-sm" style="margin-left: 50px; margin-right: 50px"/>
      </q-item-label>
      <template v-for="item in newsOptions" :key="item.newsId">
        <q-item class="q-pa-none" style="text-align: center; font-size: 12px" clickable :to="{name: 'news', query : {newsId: item.newsId}}">
          <q-item-section class="q-pa-none">
            <q-item-label lines="2">{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <div style="text-align: center" class="q-pa-none q-pt-md">
        <q-btn :class="theme('bg-primary','bg-white')" :style="theme('color: #fff','color: #131313')" size="sm" :to="'/news'" flat label="Читать еще" no-caps></q-btn>
      </div>
    </q-list>
  </div>
</template>

<script>

import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import {theme} from "src/services/other/tools";

export default {
  name: "MainPageNews",
  setup() {
    const store = useStore();
    const firstPage = computed( () => {
      const map = store.state.news.news;
      return map.get(0);
    });
    const newsOptions = computed(()=> {
      if (firstPage.value) {
        return firstPage.value.content.slice(0,4);
      } else {
        return [];
      }
    })

    onMounted(async () => {
      store.commit('news/clearMainPageNews');
      await store.dispatch('news/loadNewsPage', {pageNumber: 0});
    })


    return {
      newsOptions,
      theme,
    }
  }
}
</script>

<style lang="css">
</style>
