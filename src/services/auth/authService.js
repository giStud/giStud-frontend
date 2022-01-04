import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

class AuthService {
  async login(user) {
    try {
      const {data} = await api.post('/auth/signin', {
        username: user.username,
        password: user.password
      });
      return data;
    } catch (e) {
      throw e;
    }
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

  async loadUserInfo() {
    try {
      const {data} = await api.get("/auth/info", {headers: await authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new AuthService();
