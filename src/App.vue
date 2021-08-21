<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { mapActions, useStore } from "vuex";
import setupInterceptors from "./services/setupInterceptors"

export default defineComponent({
  name: "App",
  mounted() {
    setupInterceptors(this.$store);
  },
});
</script>
