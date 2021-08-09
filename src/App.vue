<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { mapActions, useStore } from "vuex";

export default defineComponent({
  name: "App",
  computed: {
    currentUser() {
      console.log(this.$store);
      return this.$store.state.auth.user;
    },
  },
  methods: {
    ...mapActions("auth", ["logoutAction"]),
    logOut() {
      console.log(this.$store);
      this.logoutAction();
      this.$router.push("/login");
    },
  },
});
</script>
