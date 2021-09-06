<template>
  <div class="q-pa-md">
    <q-list>
      <q-item-label id="header-news" header>Последние новости</q-item-label>

      <template v-for="item in newsOptions" :key="item.newsId">
        <q-item clickable @click="url('http://www.rsci.ru/grants/grant_news/297/243693.php')">
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
      console.log("onMounted")
      store.commit('news/clearMainPageNews');
      const data = await store.dispatch('news/getNewsPage', {existingNews : []});
      store.commit('news/setMainPageNews', data);
      newsOptions.value = store.getters['news/getMainPageNews'];
      console.log(newsOptions.value)
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
