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
        @failed="onFailed"
      />
    </div>
    <div>
      <q-uploader
        field-name="zips"
        method="POST"
        :headers="headers"
        url="http://localhost:8080/schedulesLoading/zips"
        label="Загрузка архивов"
        multiple
        batch
        style="max-width: 300px"
        @failed="onFailed"
      />
    </div>
  </div>
</template>

<script>
import authHeader from "../services/authHeader";
import TokenService from "src/services/tokenService";
import {useStore} from "vuex";

export default {
  setup() {
    const store = useStore();
    const onFailed = ((info) => {
      if (info.xhr.status === 401) {
        const {accessToken, refreshToken} = TokenService.refreshTokens()
        store.dispatch('auth/refreshTokensAction', accessToken, refreshToken);
      }
    })

    const headers = Object.entries(authHeader()).map(([key, value])=>{
      return {name : key, value}
    })
    return {
      headers,
      onFailed
    };
  },
};
</script>

<style></style>
