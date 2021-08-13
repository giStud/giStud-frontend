import {api} from "boot/axios";

class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accessToken;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  updateLocalRefreshToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.refreshToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  setUser(user) {
    console.log(JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  }

  removeUser() {
    localStorage.removeItem("user");
  }

  async refreshTokens() {
    const rs = await api.post("/auth/refreshtoken", {
      refreshToken: this.getLocalRefreshToken(),
    });

    const {accessToken, refreshToken} = rs.data;
    this.updateLocalAccessToken(accessToken);
    this.updateLocalRefreshToken(refreshToken);
    return rs.data
  }
}

export default new TokenService();
