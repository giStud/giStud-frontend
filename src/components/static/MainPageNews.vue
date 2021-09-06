<template>
  <div class="q-pa-md">
    <q-list>
      <q-item-label id="header-news" header>Последние новости</q-item-label>

      <template v-for="item in newsOptions" :key="item.newsId">
        <q-item clickable :to="{name: 'news', query : {newsId: item.newsId}}">
          <q-item-section>
            <q-item-label class="list-title" >{{item.title}}</q-item-label>
<!--            <q-item-label lines="2" v-html="item.shortText"/>-->
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script>

import {useStore} from "vuex";
import {onMounted, ref} from "vue";

export default {
  name: "MainPageNews",
  setup() {
    const store = useStore();
    const newsOptions = ref([]);

    onMounted(async () => {
      store.commit('news/clearMainPageNews');
      const data = await store.dispatch('news/getNewsPage', {existingNews : []});
      store.commit('news/setMainPageNews', data);
      newsOptions.value = store.getters['news/getMainPageNews'];
    })


    return {
      newsOptions
    }
  }
}
</script>

<style lang="css">
@import 'src/css/home.css';
</style>
