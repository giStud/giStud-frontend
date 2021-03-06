import {api} from 'boot/axios'
import EventBus from "src/common/eventBus";
import TokenService from "../auth/tokenService"

const setup = (store) => {
  api.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url === "/auth/refreshtoken" && err.response) {
        //How refresh token was expired, we need to logout user from system (maybe router push to login page)
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;
          EventBus.dispatch("logout");
          return api(originalConfig);
        }
      }
      if (originalConfig.url !== "/auth/signin" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const {accessToken, refreshToken} = await TokenService.refreshTokens()
            await store.dispatch('auth/refreshTokensAction', accessToken, refreshToken);
            originalConfig.headers["Authorization"] = 'Bearer ' + accessToken;
            return api(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
