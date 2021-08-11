<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input
        @update:model-value="
          (val) => {
            files = val;
          }
        "
        ref="inputFiles"
        multiple
        filled
        type="file"
        hint="Native file (multiple)"
      />
    </div>
    <div>
      <q-btn color="primary" style="width: 200px" @click="loadSchedules">
        <div class="ellipsis">
          Загрузить
        </div>
      </q-btn>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
export default {
  setup() {
      const files = ref(null)
      const loadSchedules = () => {
          if(files.value) {

          }
      }
    return {
      files,
      loadSchedules
    };
  },
};
</script>

<style></style>
