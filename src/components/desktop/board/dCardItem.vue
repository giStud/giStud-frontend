<template>
  <q-card style="height: 300px; width: 228px;" @click="navigateToCard(data.id)">
    <q-card-section class="q-pt-sm q-pb-none">{{data.category ? data.category.title : ''}}</q-card-section>
    <q-card-section class="q-pa-none">
      <q-img height="156px" width="228px" :src="logoViewUrl"></q-img>
    </q-card-section>
    <q-card-section class="q-pt-none q-pb-sm">{{data.name}}</q-card-section>
    <q-card-section class="q-pt-none q-pb-sm" v-if="data.price">{{data.price}} Р.</q-card-section>
    <q-card-section class="row q-py-none q-col-gutter-x-sm">
      <div v-for="tag in data.tags" :key="tag.title">
        <q-chip dense outline color="primary" text-color="white" icon="tag">
          {{ tag.title }}
        </q-chip>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none q-pb-sm row justify-between">
      <div>{{data.createdDate}}</div>
      <div class="col-3">
        {{data.views}}
        <q-icon name="visibility" size="sm"/>
      </div>


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
