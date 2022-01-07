import { boot } from 'quasar/wrappers'
import {api, axios} from "boot/axios";
import EventBus from "src/common/eventBus";
import {Dark, Platform} from "quasar";
import {isTokenExpired} from "../services/auth/tokenService"

export default boot(async ( { store, router } ) => {
  let userFromStorage = await JSON.parse(localStorage.getItem('user'));
  let accessTokenFromStorage = await JSON.parse(localStorage.getItem('accessToken'));
  let refreshTokenFromStorage = await JSON.parse(localStorage.getItem('refreshToken'))
  store.commit('auth/setUser', userFromStorage);
  store.commit('auth/setAccessToken', accessTokenFromStorage);
  store.commit('auth/setRefreshToken', refreshTokenFromStorage);

  EventBus.on("logout", async () => {
    store.dispatch("auth/logoutAction");
    await router.push("/auth/login");
  });
  Dark.set(localStorage.getItem("darkTheme") === "1");

  const cancelRequest = async (cause) => {
    await EventBus.dispatch("logout");
    throw new axios.Cancel(cause);
  }

  api.interceptors.request.use(
    async (config) => {
      const authHeader = config.headers["Authorization"];
      if (authHeader) {
        let accessToken = store.getters['auth/getAccessToken'];
        let refreshToken = store.getters['auth/getRefreshToken'];
        try {
          if (accessToken && refreshToken) {
            let accessTokenString = accessToken.type + ' ' + accessToken.token;
            if (accessTokenString !== authHeader) {
              await cancelRequest('Access token from local storage doesnt equals access token from vuex store');
            }

            if (isTokenExpired(accessToken)) {
              console.log("Access token was expired")
              if (isTokenExpired(refreshToken)) {
                await cancelRequest("Refresh token was expired")
              } else {
                const refreshTokenValue = refreshToken.token;
                if (await store.dispatch('auth/refreshTokensAction', refreshTokenValue)) {
                  accessToken = store.getters['auth/getAccessToken'];
                  //config.headers["Authorization"] = accessToken.type + ' ' + accessToken.token;
                } else {
                  await cancelRequest("Error in refresh token action")
                }
              }
            }
          } else {
            await cancelRequest("No access or refresh tokens")
          }
        } catch (e) {
          console.log(e);
          await cancelRequest(e);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  try {
    const currentUser = store.getters['auth/getCurrentUser'];
    if (currentUser) {
      await store.dispatch('auth/loadUserInfoAction');
    } else {
      EventBus.dispatch("logout");
    }
  } catch (e) {
    EventBus.dispatch("logout");
    console.log(e);
  }
})
