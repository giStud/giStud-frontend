<template>
  <q-card style="width: 200px; height: 300px" @click="navigateToCard(data.id)">
    <q-card-section>
      <q-img height="200px" width="165px" :src="logoViewUrl"></q-img>
    </q-card-section>
    <q-card-section>{{data.name}}</q-card-section>
    <q-card-section>{{data.category ? data.category.title : ''}}</q-card-section>
    <q-card-section>{{data.createdDate}}</q-card-section>
    <q-card-section v-if="data.price">{{data.price}}</q-card-section>
    <q-card-section class="row justify-between">
      <div class="col-9">
        <div class="row">
          <div v-for="tag in data.tags" :key="tag.title">
            <q-chip outline color="primary" text-color="white" icon="tag">
              {{ tag.title }}
            </q-chip>
          </div>
        </div>
      </div>
      <div class="col-3">{{data.views}}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {date, useQuasar} from "quasar";
import {useStore} from "vuex";
import {getFileAndDataUrlByByteArray} from "src/composables/board/boardUtils";
import {useRouter} from "vue-router";

export default {
  name: "dCardItem",
  props : {
    card : Object
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const data = ref({
      id: null,
      name: '',
      category: null,
      description: '',
      tags: [],
      logoImage: null,
      contactPhone: '',
      contactMail: '',
      createdByUser : null,
      views : '',
      price : null,
      createdDate : ''
    });

    const logoViewUrl = ref(null);

    const navigateToCard = (id) => {
      router.push(`/board/card/${id}`)
    }

    onMounted(async ()=> {
      data.value = props.card;
      data.value.createdDate = date.formatDate(data.value.createdDate, 'YYYY-MM-DD HH:mm');
      const logoImage = props.card.logoImage;
      if (logoImage) {
        const {byteArray, fileName} = await store.dispatch('board/downloadAttachmentByIdAction', logoImage.id);
        const {dataUrl} = await getFileAndDataUrlByByteArray(byteArray, fileName);
        logoViewUrl.value = dataUrl;
      }
    })

    return {
      data,
      logoViewUrl,
      navigateToCard
    }
  }
}
</script>

<style scoped>

</style>
