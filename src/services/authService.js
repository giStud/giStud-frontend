import { api } from "boot/axios";
import TokenService from "./tokenService";

class AuthService {
  async login(user) {
    try {
      const {data} = await api.post('/auth/signin', {
        username: user.username,
        password: user.password
      });
      if (data.accessToken) {
        TokenService.setUser(data)
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  logout() {
    TokenService.removeUser();
  }

  async register(user) {
    try {
      const {data} = await api.post("/auth/signup", {
        username: user.username,
        email: user.email,
        password: user.password,
      })
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new AuthService();
