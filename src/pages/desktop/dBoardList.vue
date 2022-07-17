<template>
  <q-card>
    <div class="row q-gutter-md">
      <template v-for="card in cards" :key="card.id" >
        <d-card-item :card="card" class="col-3"></d-card-item>
      </template>
    </div>

  </q-card>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import dCardItem from "components/desktop/board/dCardItem";

export default {
  name: "dBoard",
  components: {
    dCardItem
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();
    const lastPage = ref(null);
    const cards = ref([]);

    onMounted(async () => {
      console.log(1)
      lastPage.value = await store.dispatch('board/getCardsPage', {
        pageNumber: 0,
        pageSize: 100
      })
      console.log(lastPage.value)
      cards.value = lastPage.value.content;
    })

    return {
      cards
    }
  }
}
</script>

<style scoped>

</style>
