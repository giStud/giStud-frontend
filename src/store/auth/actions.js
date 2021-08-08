import AuthService from '../../services/auth-service';

export function loginAction({ commit }, user) {
  try {
    const data = AuthService.login(user);
    commit('loginSuccessMut', user);
    return data;
  } catch (e) {
    commit('loginFailureMut');
    console.error(e)
  }
}

export function logoutAction({ commit }) {
    AuthService.logout();
    commit('logoutMut');
}

export function registerAction({ commit }, user) {
  try {
    const data = AuthService.register(user);
    commit('registerSuccessMut');
    return data;
  } catch (e) {
    commit('registerFailureMut');
    console.error(e)
  }
}

