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
    state.loggedIn = true;
}

export function registerFailureMutation(state) {
    state.loggedIn = false;
}
