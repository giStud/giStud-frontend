export function loginSuccessMutation(state, user) {
    state.loggedIn = true;
    state.user = user;
}

export function loginFailureMutation(state) {
    state.loggedIn = false;
    state.user = null;
}

export function logoutMutation(state) {
    state.loggedIn = false;
    state.user = null;
}

export function registerSuccessMutation(state) {
    state.loggedIn = false;
}

export function registerFailureMutation(state) {
    state.loggedIn = false;
}

export function refreshTokensMutation(state, accessToken, refreshToken) {
    state.loggedIn = true
    state.user = {...state.user, accessToken, refreshToken}
}

export function userRolesMutation(state, roles) {
  state.user = {...state.user, roles}
}
