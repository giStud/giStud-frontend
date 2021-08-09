<template>
  <div>
    <header class="jumbotron">
      <h3>
        <strong>{{user.username}}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Token:</strong>
      {{user.accessToken.substring(0, 20)}} ... {{user.accessToken.substr(user.accessToken.length - 20)}}
    </p>
    <p>
      <strong>Id:</strong>
      {{user.id}}
    </p>
    <p>
      <strong>Email:</strong>
      {{user.email}}
    </p>
    <strong>Authorities:</strong>
    <ul>
      <li v-for="role in currentUser.roles" :key="role">{{role}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    currentUser() {
      console.log(this.$store.state.auth.user)
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    console.log(this.user)
    console.log(this.currentUser)
    if (!this.user) {
      this.$router.push('/login');
    } else {

    }
  }
};
</script>

<style>

</style>
