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
      <q-card-section class="row q-pt-md q-col-gutter-x-xl q-col-gutter-y-md">
        <div class="col-6 col-md-3">
          <q-select v-model="cardFilters.sortProperty" @update:model-value="onFiltersChanged" options-dense :options="SORT_PROPERTIES"
                    map-options emit-value dense label="Сортировать по"/>
        </div>
        <div class="col-6 col-md-3">
          <q-select v-model="cardFilters.sortDirection" @update:model-value="onFiltersChanged" options-dense :options="SORT_DIRECTIONS"
                    map-options emit-value dense label="В порядке"/>
        </div>
        <div class="col-6 col-md-3">
        </div>
        <div class="col-6 col-md-3 row">
          <q-space/>
          <q-btn round color="primary" glossy icon="filter_alt" @click="filtersDialog = true"/>
        </div>
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
    <q-dialog v-model="filtersDialog">
      <q-card class="q-pa-sm" style="min-width: 600px">
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none items-center">
          <q-input dense filled v-model="cardFilters.titleLike" label="Фильтрация по заголовку"></q-input>
        </q-card-section>
        <q-card-section class="q-px-md q-pb-md q-mx-sm q-mt-lg q-ma-none items-center">
          <q-input dense filled v-model="cardFilters.descriptionLike" label="Фильтрация по описанию"></q-input>
        </q-card-section>
        <q-card-section v-if="isAdmin">
          <q-select v-model="cardFilters.statusIn" multiple options-dense :options="STATUS_OPTIONS" dense
                    map-options emit-value
                    label="Фильтрация по статусу"/>
        </q-card-section>
        <q-card-section class="q-mx-sm q-pb-md row justify-between">
          <q-input style="min-width: 242px" mask="#.##" reverse-fill-mask dense filled v-model="cardFilters.minPrice" label="Цена От"/>
          <q-input style="min-width: 242px" mask="#.##" reverse-fill-mask dense filled v-model="cardFilters.maxPrice" label="Цена До"/>
        </q-card-section>
        <q-card-section class="q-mx-sm q-pb-md row justify-between">
          <q-input dense filled v-model="cardFilters.createdDateMin">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="cardFilters.createdDateMin" mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="cardFilters.createdDateMin" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input dense filled v-model="cardFilters.createdDateMax">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="cardFilters.createdDateMax" mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="cardFilters.createdDateMax" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions class="q-mx-md q-pb-md row">
          <q-btn size="md" style="width: 110px" no-caps
                 color="primary" label="Поиск"
                 @click="onFiltersChanged" v-close-popup/>
          <q-btn size="md" style="width: 110px" no-caps
                 label="Сбросить"
                 @click = "onFiltersClear"
                 v-close-popup/>
          <q-space/>
          <q-btn size="md" style="width: 110px;" color="red-5" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import {CARD_STATUS} from "src/services/board/cardService";
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
const SORT_PROPERTIES = [
  {
    label: 'Популярности',
    value: 'views'
  },
  {
    label: 'Дате создания',
    value: 'createdDate'
  },
  {
    label: 'Цене',
    value: 'price'
  },
]
const SORT_DIRECTIONS = [
  {
    label: 'Возрастания',
    value: 'ASC'
  },
  {
    label: 'Убывания',
    value: 'DESC'
  },
]
const STATUS_OPTIONS = [
  {
    label: 'Ожидание проверки',
    value: 'WAITING_APPROVAL'
  },
  {
    label: 'Проверено',
    value: 'APPROVED'
  },
  {
    label: 'Заблокировано',
    value: 'BANNED'
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
    const isAdmin = computed(() => store.getters['auth/isAdmin']);

    const getEmptyCardFilters = () => {
      return {
        pageSize: 24,
        sortDirection : null,
        sortProperty : null,
        categoriesIn : CATEGORIES_DATA.map(c => c.name),
        minPrice : null,
        maxPrice : null,
        titleLike : null,
        descriptionLike : null,
        createdDateMin : null,
        createdDateMax : null,
        createdByUser : null,
        statusIn : [CARD_STATUS.APPROVED],
        tagsIn : [],
      };
    }

    const lastLoadedPage = ref(null);
    const loadedCards = ref([]);
    const cardFilters = ref(getEmptyCardFilters());
    const filtersDialog = ref(false);

    const onFiltersChanged = async () => {
      lastLoadedPage.value = await findCardPage(0, cardFilters.value);
      loadedCards.value = lastLoadedPage.value.content;
    }

    const onFiltersClear = async () => {
      cardFilters.value = getEmptyCardFilters();
      await onFiltersChanged();
    }

    const loadNewCardsPage = async (index, done) => {
      if (!lastLoadedPage.value || lastLoadedPage.value.last) {
        done();
      } else {
        lastLoadedPage.value = await findCardPage(lastLoadedPage.value.pageNumber + 1, cardFilters.value);
        loadedCards.value.push(...lastLoadedPage.value.content);
        done();
      }
    }

    const categoriesScrollAreaPosition = ref(300)
    const categoriesScrollAreaRef = ref(null);

    const toggleCardCategory = (category) => {
      const index = cardFilters.value.categoriesIn.indexOf(category);
      if (index > -1) {
        cardFilters.value.categoriesIn.splice(index, 1);
      } else {
        cardFilters.value.categoriesIn.push(category);
      }
    }

    const isCategoryActive = (category) => {
      return cardFilters.value.categoriesIn.indexOf(category) !== -1;
    }

    const animateScrollCategories = async (val) => {
      const {horizontalPercentage} = categoriesScrollAreaRef.value.getScroll();
      if ((horizontalPercentage !== 1.0 && val > 0) || (horizontalPercentage !== 0.0 && val < 0)) {
        categoriesScrollAreaPosition.value = categoriesScrollAreaPosition.value + val;
        categoriesScrollAreaRef.value.setScrollPosition('horizontal', categoriesScrollAreaPosition.value, 300)
      }
    }

    const findCardPage = async (pageNumber, filters) => {
      return await store.dispatch('board/getCardsPage', {
        pageNumber,
        ...filters
      });
    }

    watch(cardFilters.value.categoriesIn, onFiltersChanged)

    onMounted(async () => {
      lastLoadedPage.value = await findCardPage(0, cardFilters.value);
      loadedCards.value = lastLoadedPage.value.content;
    })

    return {
      loadedCards,
      categoriesScrollAreaRef,
      categoriesScrollAreaPosition,
      cardFilters,
      filtersDialog,
      isAdmin,
      CATEGORIES_DATA,
      SORT_PROPERTIES,
      SORT_DIRECTIONS,
      STATUS_OPTIONS,
      animateScrollCategories,
      toggleCardCategory,
      isCategoryActive,
      loadNewCardsPage,
      onFiltersChanged,
      onFiltersClear
    }
  }
}
</script>

<style scoped>

.categories-list-active {
  border: 1px solid #1976D2;
}
</style>
