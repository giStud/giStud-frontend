<template>
  <input v-model="inputField" ref="searchInput" :class="theme('search-box-l', 'search-box-d')" autocomplete="off"
         type="text" name="search" placeholder="Поиск" class="q-pa-sm search-box gistud-dev"/>
  <q-menu :target="$refs.searchInput" no-focus :offset="[0, 11]" square>
    <q-list style="width: 180px; max-width: 180px; max-height: 400px">
      <q-item style="height: 50px; max-height: 50px;" clickable v-close-popup v-for="(line) of options" :key="line" @click="handleSearchClick(line)">
        <q-item-section>
          <q-item-label lines="1">{{line.name}}</q-item-label>
          <q-item-label caption lines="1">{{ getCategoryString(line.category) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import {goUrl, theme} from "src/services/other/tools";
import {ref, watch} from "vue";
import SearchService from "src/services/other/searchService"
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

const numberOfLines = 8;
const staticLinks = [
  {
    link : '/home',
    name : 'Главная',
    description : 'Домашняя страница',
    category : 'OTHER'
  },
  {
    link : '/schedule',
    name : 'Расписание',
    description : 'Расписание ваших занятий',
    category : 'OTHER'
  },
  {
    link : '/news',
    name : 'Новости',
    description : 'Студенческие новости',
    category : 'OTHER'
  },
  {
    link : '/ads',
    name : 'Доска объявлений',
    description : 'Последние объявления',
    category : 'OTHER'
  }
]

export default {
  name: "SearchBox",
  setup() {
    const router = useRouter();
    const inputField = ref('');
    const options = ref([]);
    watch(inputField, async (newVal)=> {
      if (newVal !== '') {
        options.value = await SearchService.getResult(newVal);
        if (options.value.length !== numberOfLines) {
          for (let link of staticLinks) {
            if (options.value.length !== numberOfLines && link.name.includes(inputField.value)) {
              options.value.push(link);
            }
          }
        }
        console.log(options.value)
      } else {
        options.value = [];
      }
    })

    const getCategoryString = (category) => {
      switch (category) {
        case 'UNIV': return 'Университеты';
        case 'GROUP': return 'Группы';
        case 'AD': return 'Объявления';
        case 'NEWS': return 'Новости';
        default: return 'Другое';
      }
    }

    const handleSearchClick = (line) => {
      switch (line.category) {
        case 'UNIV': {
          router.push({name: 'schedule', query : {univId: line.id}});
          break;
        }
        case 'GROUP': {
          router.push({name: 'schedule', query : {grId: line.id}});
          break;
        }
        case 'AD': {
          //router.push({name: 'ads', query : {newsId: line.id}});
          break;
        }
        case 'NEWS':  {
          router.push({name: 'news', query : {newsId: line.id}});
          break;
        }
        case 'OTHER':  {
          router.push(line.link);
          break;
        }
      }

    }

    return {
      inputField,
      options,
      theme,
      getCategoryString,
      handleSearchClick
    }
  }
}
</script>

<style scoped>
.search-box {

}

.search-box {
  width: 180px;
  height: 26px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
  padding: 12px 20px 12px 30px;
  background-size: 16px;
  background-position: 5px 5px;
  background-repeat: no-repeat;
  border: 0 solid #a3a3a3;
}

.search-box-l {
  background-image: url('https://cdn.discordapp.com/attachments/887281514809802806/889373223895068733/search-solid-l.svg');
  background-color: #edeef0;
}

.search-box-d {
  background-image: url('https://cdn.discordapp.com/attachments/887281514809802806/889373218392141854/search-solid-d.svg');
  background-color: #3f4349;
  color: white;
}
</style>
