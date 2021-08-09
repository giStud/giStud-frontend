import AuthService from '../../services/auth-service';

export function loginAction({ commit }, user) {
  try {
    const data = AuthService.login(user);
    commit('loginSuccessMutation', user);
    return data;
  } catch (e) {
    commit('loginFailureMutation');
    console.error(e)
  }
}

export function logoutAction({ commit }) {
    AuthService.logout();
    commit('logoutMutation');
}

export async function registerAction({ commit }, user) {
  try {
    const data = await AuthService.register(user);
    console.error('action success: ' + data)
    commit('registerSuccessMutation');
    return data;
  } catch (e) {
    commit('registerFailureMutation');
    throw e;
  }
}

