import { api } from "boot/axios";

class AuthService {
  async login(user) {
    const response = await api.post('/auth/signin', {
      username: user.username,
      password: user.password
    });
    if (response.data.accessToken) {
      console.log('auth-service-login:' + response.data)
      console.log('auth-service-login:' + JSON.stringify(response.data))
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(user) {
    return await api.post("/auth/signup", {
      username: user.username,
      email: user.email,
      password: user.password,
    }).data;
  }
}

export default new AuthService();
