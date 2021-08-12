<template>
  <div class="q-pa-md">
    <div>
      <q-uploader
        field-name="files"
        method="POST"
        :headers="headers"
        url="http://localhost:8080/schedulesLoading"
        label="Загрузка расписания"
        multiple
        batch
        style="max-width: 300px"
      />
    </div>
  </div>
</template>

<script>
import authHeader from "../services/authHeader";

export default {
  setup() {
    const headers = Object.entries(authHeader()).map(([key, value])=>{
      return {name : key, value}
    })
    return {
      headers
    };
  },
};
</script>

<style></style>
