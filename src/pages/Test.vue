<template>
  <q-page>
    <q-input v-model="id" label="Идентификатор вложения"/>
    <q-btn class="btr-square" color="primary" no-caps label="Загрузить"
           @click="loadImage(id)"/>
    <q-img :src="dataUrl" width="400px">

    </q-img>
  </q-page>
</template>

<script>
import {ref, defineComponent, onMounted, computed} from "vue";
import {useStore} from "vuex";
import UserMessagesService from "src/services/other/userMessagesService";

export default defineComponent({
  name: "Test",
  setup() {
    const store = useStore();
    const id = ref(0);
    const image = computed(()=> store.getters['board/getImage'])
    const dataUrl = computed(()=> {
      if (image.value != null) {

        return 'data:image/png;base64,' + btoa(
          new Uint8Array(image.value)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      } else {
        return null;
      }
    })
    const loadImage = async (id) => {
      await store.dispatch('board/downloadAttachmentByIdAction', id);
      console.log(image.value)
    }

    /*onMounted(async () => {
    })*/

    return {
      id,
      loadImage,
      dataUrl
    }
  }
})
</script>

<style scoped lang="css">

.q-select::v-deep .q-field__control {
  height: 25px;
  min-height: 25px;
}
.q-select::v-deep .q-field__native {
  min-height: 25px;
  height: 25px;
}
.q-select::v-deep {
  height: 25px;
  background: #b9ffb9;
}
</style>
