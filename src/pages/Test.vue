<template>
  <q-page>
    <q-select input-style="25px" style="width: 120px" v-model="search" :options="options" hide-dropdown-icon>
    </q-select>

  </q-page>
</template>

<script>
import {ref} from "vue";

export default {
  name: "Test",
  setup() {
    const search = ref('string1');
    const options = ref(['string2', 'string3']);
    return {
      search,
      options
    }
  }
}
</script>

<style scoped lang="css">

.q-select::v-deep .q-field__control {
  height: 25px;
  min-height: 25px;
}
.q-select::v-deep .q-field--auto-height {
  min-height: 25px;
  height: 25px;
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
