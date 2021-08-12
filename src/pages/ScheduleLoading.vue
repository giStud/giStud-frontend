<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <input type="file" @change="setFiles" multiple="">
    </div>
    <div>
      <q-btn color="primary" style="width: 200px" @click="loadSchedules">
        <div class="ellipsis">
          Загрузить
        </div>
      </q-btn>
    </div>
    <div>
      <q-uploader
        field-name="files"
        method="POST"
        :headers="headers"
        url="http://localhost:8080/schedulesLoading"
        label="Загрузка расписания"
        multiple
        style="max-width: 300px"
      />
    </div>
  </div>
</template>

<script>
import authHeader from "../services/authHeader";

export default {
  setup() {

    console.log(authHeader())
    [{key : Auth, value : token}]
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
