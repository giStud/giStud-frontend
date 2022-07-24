export function getCurrentUser (state) {
  return state.user;
}

export function isLogged (state) {
  return state.loggedIn;
}

export function getAccessToken (state) {
  return state.accessToken;
}

export function getRefreshToken (state) {
  return state.refreshToken;
}


export function isAdmin (state) {
  if (!state.user) {
    return false;
  } else {
    if (state.user.roles) {
      return state.user.roles.includes("ROLE_ADMIN")
    } else {
      return false;
    }
  }
}
