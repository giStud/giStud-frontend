import AuthService from '../../services/auth-service';

export async function loginAction({ commit }, user) {
  try {
    const data = await AuthService.login(user);
    commit('loginSuccessMutation', user);
    return data;
  } catch (e) {
    commit('loginFailureMutation');
    console.error(e);
    throw e;
  }
}

export function logoutAction({ commit }) {
    AuthService.logout();
    commit('logoutMutation');
}

export async function registerAction({ commit }, user) {
  try {
    const data = await AuthService.register(user);
    commit('registerSuccessMutation');
    return data;
  } catch (e) {
    commit('registerFailureMutation');
    throw e;
  }
}

