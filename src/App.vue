<template>
  <router-view />
</template>
<script>
import {defineComponent, onMounted} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(()=> {
      console.log(process.env.API)
    })
  }
});
</script>
