<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="row justify-between no-wrap">
          <q-btn label="<"  round flat class="col-1" @click="animateScrollCategories(-600)"/>
          <q-scroll-area id="categories-scroll-area" ref="categoriesScrollAreaRef" style="height: 160px;"  class="col-10">
            <q-list id="categories-scroll-area-list" class="row no-wrap justify-between">
              <template v-for="(category) in CATEGORIES_DATA" :key="category.name">
                <q-item
                  dense
                  clickable
                  class="q-ma-md q-pa-none"
                  @click="toggleCardCategory(category.name)"
                  :active="isCategoryActive(category.name)"
                  active-class="categories-list-active"
                >
                  <q-card bordered style="width: 125px; height: 125px" class="shadow-1 q-ma-none q-pa-none">
                    <q-card-section class="q-ma-md q-pa-none row no-wrap">
                      <q-icon size="md" :name="category.icon"/>
                    </q-card-section>
                    <q-separator class="q-mx-md q-mt-lg"></q-separator>
                    <q-card-section class="q-mt-sm q-mx-md  q-pa-none">
                      <span style="color: gray">{{ category.label }}</span>
                    </q-card-section>
                  </q-card>
                </q-item>
              </template>
            </q-list>
          </q-scroll-area>
          <q-btn label=">" round flat class="col-1" @click="animateScrollCategories(600)"/>
        </div>
      </q-card-section>
      <q-card-section>

      </q-card-section>
      <q-card-section>
        <q-infinite-scroll @load="loadNewCardsPage" :offset="250" debounce="500">
          <div class="row q-gutter-md">
            <template v-for="card in loadedCards" :key="card.id" >
              <d-card-item :card="card" class="col-3"></d-card-item>
            </template>
          </div>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>

      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import dCardItem from "components/desktop/board/dCardItem";

const CATEGORIES_DATA = [
  {
    name: "EDUCATION",
    label: "Учёба",
    icon: "school"
  },
  {
    name: "SPORT",
    label: "Спорт",
    icon: "sports_volleyball"
  },
  {
    name: "JOB",
    label: "Работа",
    icon: "work"
  },
  {
    name: "TRADE",
    label: "Продажа/обмен",
    icon: "shopping_cart"
  },
  {
    name: "LOVE",
    label: "Отношения",
    icon: "favorite"
  },
  {
    name: "FUN",
    label: "Развлечения",
    icon: "celebration"
  },
  {
    name: "OTHER",
    label: "Другое",
    icon: "view_comfy"
  }
]

export default {
  name: "dBoard",
  components: {
    dCardItem
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();
    const lastLoadedPage = ref(null);
    const loadedCards = ref([]);

    const loadNewCardsPage = async (index, done) => {
      if (!lastLoadedPage.value || lastLoadedPage.value.last) {
        done();
      } else {
        lastLoadedPage.value = await store.dispatch('board/getCardsPage', {
          pageNumber: lastLoadedPage.value.pageNumber + 1,
          pageSize: 24
        });
        loadedCards.value.push(...lastLoadedPage.value.content);
        done();
      }
    }

    const selectedCategories = ref(CATEGORIES_DATA.map(c => c.name));
    const categoriesScrollAreaPosition = ref(300)
    const categoriesScrollAreaRef = ref(null);

    const toggleCardCategory = (category) => {
      const index = selectedCategories.value.indexOf(category);
      if (index > -1) {
        selectedCategories.value.splice(index, 1);
      } else {
        selectedCategories.value.push(category);
      }
    }

    const isCategoryActive = (category) => {
      return selectedCategories.value.indexOf(category) !== -1;
    }

    const animateScrollCategories = async (val) => {
      const {horizontalPercentage} = categoriesScrollAreaRef.value.getScroll();
      if ((horizontalPercentage !== 1.0 && val > 0) || (horizontalPercentage !== 0.0 && val < 0)) {
        categoriesScrollAreaPosition.value = categoriesScrollAreaPosition.value + val;
        categoriesScrollAreaRef.value.setScrollPosition('horizontal', categoriesScrollAreaPosition.value, 300)
      }
    }

    onMounted(async () => {
      lastLoadedPage.value = await store.dispatch('board/getCardsPage', {
        pageNumber: 0,
        pageSize: 24
      })
      loadedCards.value = lastLoadedPage.value.content;
    })

    return {
      loadedCards,
      categoriesScrollAreaRef,
      categoriesScrollAreaPosition,
      CATEGORIES_DATA,
      animateScrollCategories,
      toggleCardCategory,
      isCategoryActive,
      loadNewCardsPage
    }
  }
}
</script>

<style scoped>

.categories-list-active {
  border: 1px solid #1976D2;
}
</style>
