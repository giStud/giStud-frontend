<template>
  <q-card style="width: 200px; height: 300px">
    <q-card-section>
      <q-img :src="imgUrl"></q-img>
    </q-card-section>
    <q-card-section>{{title}}</q-card-section>
    <q-card-section>{{category ? category.title : ''}}</q-card-section>
    <q-card-section>С {{dateFrom}} по {{dateTo}}</q-card-section>
    <q-card-section class="row justify-between">
      <div class="col-9">
        <div class="row">
          <div v-for="tag in tags" :key="tag.title">
            <q-chip outline color="primary" text-color="white" icon="tag">
              {{ tag.title }}
            </q-chip>
          </div>
        </div>
      </div>
      <div class="col-3">{{views}}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useStore} from "vuex";

export default {
  name: "dCardItem",
  props : {
    card : Object
  },
  setup(props) {
    const store = useStore();
    const $q = useQuasar();

    const title = ref('');
    const category = ref(null);
    const dateFrom = ref('');
    const dateTo = ref('');
    const tags = ref([]);
    const views = ref('');

    const logo = ref(null);
    const imgUrl = computed(()=> {
      if (logo.value != null) {
        console.log('test')
        console.log(logo.value)
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(logo.value)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      } else {
        return null;
      }
    })

    onMounted(async ()=> {
      title.value = props.card.name;
      category.value = props.card.category;
      dateFrom.value = props.card.startDate;
      dateTo.value = props.card.finishDate;
      tags.value = props.card.tags;
      views.value = props.card.views;

      const logoImage = props.card.logoImage;
      if (logoImage) {
        logo.value = await store.dispatch('board/downloadAttachmentByIdAction', logoImage.id);
      }
    })

    return {
      title,
      category,
      dateFrom,
      dateTo,
      tags,
      views,
      imgUrl
    }
  }
}
</script>

<style scoped>

</style>
