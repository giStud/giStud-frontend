<template>
  <q-page>
    <q-card>
      <d-card-filter @onFilterChanged="onFiltersChanged"/>
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
import dCardItem from "components/desktop/board/dCardItem";
import dCardFilter from "components/desktop/board/dCardFilter";
import {useStore} from "vuex";
import {useQuasar} from "quasar";
import {computed, onMounted, ref} from "vue";

export default {
  name: "dMyCardsList",
  components: {
    dCardItem,
    dCardFilter
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const lastLoadedPage = ref(null);
    const loadedCards = ref([]);
    const cardFilters = ref(null);
    const currentUser = computed(()=> store.getters['auth/getCurrentUser'])

    const onFiltersChanged = async (filters) => {
      filters.createdByUser = currentUser.value.username;
      cardFilters.value = filters;
      lastLoadedPage.value = await findCardPage(0, filters);
      loadedCards.value = lastLoadedPage.value.content;
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

    const findCardPage = async (pageNumber, filters) => {
      return await store.dispatch('board/getCardsPage', {
        pageNumber,
        ...filters
      });
    }

    onMounted(async () => {
      lastLoadedPage.value = await findCardPage(0, cardFilters.value);
      loadedCards.value = lastLoadedPage.value.content;
    })

    return {
      loadedCards,
      cardFilters,
      loadNewCardsPage,
      onFiltersChanged,
    }
  }
}
</script>

<style scoped>

</style>
