import AuthService from '../../services/auth/authService';
import TokenService from '../../services/auth/tokenService'

export async function loginAction({ commit }, user) {
  try {
    const data = await AuthService.login(user);
    if (data) {
      const user = {username : data.username, email : data.email, id : data.id, roles : data.roles};
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      commit('setUser', user);
      commit('setAccessToken', accessToken);
      commit('setRefreshToken', refreshToken);
    }
    return true;
  } catch (e) {
    commit('logoutMutation');
    console.error(e);
    return false;
  }
}

export function logoutAction({ commit }) {
  commit('logoutMutation');
}

export async function registerAction({ commit }, user) {
  try {
    const data = await AuthService.register(user);
    return !!data;
  } catch (e) {
    console.log(e)
    return false;
  }
}

export async function refreshTokensAction({commit}, refreshToken) {
  try {
    const data = await TokenService.refreshTokens(refreshToken);
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;
    commit('setAccessToken', newAccessToken);
    commit('setRefreshToken', newRefreshToken);
    return true;
  } catch (e) {
    commit('logoutMutation');
    console.log(e);
    return false;
  }

}


export async function loadUserInfoAction({commit}) {
  try {
    const data = await AuthService.loadUserInfo();
    commit('loadUserInfo', data);
  } catch (e) {
    throw e;
  }
}

