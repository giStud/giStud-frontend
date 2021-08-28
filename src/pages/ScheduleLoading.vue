<template>
  <div class="q-pa-md">
    <div>
      <q-uploader
        field-name="files"
        method="POST"
        :headers="getHeaders"
        :url="apiPath + '/schedule/schedulesLoading'"
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
        :headers="getHeaders"
        :url="apiPath + '/schedule/schedulesLoading/zips'"
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
import authHeader from "../services/auth/authHeader";
import TokenService from "src/services/auth/tokenService";
import {useStore} from "vuex";
import {computed, onMounted} from "vue";

export default {
  setup() {
    const store = useStore();
    const onFailed = ((info) => {
      if (info.xhr.status === 401) {
        const {accessToken, refreshToken} = TokenService.refreshTokens()
        store.dispatch('auth/refreshTokensAction', accessToken, refreshToken);
      }
    })

    const getHeaders = ()=> {
      return Object.entries(authHeader()).map(([key, value])=>{
        return {name : key, value}
      })
    }
    return {
      getHeaders,
      onFailed,
      apiPath : computed(()=> process.env.API)
    };
  },
};
</script>

<style></style>
