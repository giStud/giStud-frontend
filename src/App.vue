<template>
  <router-view />
</template>
<script>
import {defineComponent, onMounted} from "vue";

import EventBus from "src/common/eventBus";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(()=> {
      //console.log(process.env.API)
    })
  }
});
</script>
