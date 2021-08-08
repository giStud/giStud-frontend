export function loginSuccessMut(state, user) {
    state.loggedIn = true;
    state.user = user;
}

export function loginFailureMut(state) {
    state.loggedIn = false;
    state.user = null;
}

export function logoutMut(state) {
    state.loggedIn = false;
    state.user = null;
}

export function registerSuccessMut(state) {
    state.loggedIn = true;
}

export function registerFailureMut(state) {
    state.loggedIn = false;
}
