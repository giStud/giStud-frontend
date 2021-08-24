<template>
  <router-view />
</template>
<script>
import {defineComponent, onMounted} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "App",

  setup() {
    const store = useStore();
    onMounted(()=>{
      const user = store.getters['auth/getCurrentUser'];
      store.dispatch('auth/getUserRolesAction', {userId : user.id});
    })

    return {

    }
  }
});
</script>
