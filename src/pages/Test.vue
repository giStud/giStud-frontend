<template>
  <q-page>
    <q-select input-style="25px" style="width: 120px" v-model="search" :options="options" hide-dropdown-icon>
    </q-select>
    <q-input v-model="input" >
      <q-menu :target="true">
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>New tab</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>New incognito tab</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section>Recent tabs</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>History</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Downloads</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section>Settings</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section>Help &amp; Feedback</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-input>
  </q-page>
</template>

<script>
import {ref} from "vue";

export default {
  name: "Test",
  setup() {
    const search = ref('string1');
    const options = ref(['string2', 'string3']);
    const input = ref('');
    return {
      input,
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
.q-select::v-deep .q-field__native {
  min-height: 25px;
  height: 25px;
}
.q-select::v-deep {
  height: 25px;
  background: #b9ffb9;
}
</style>
