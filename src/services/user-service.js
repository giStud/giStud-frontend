import {api} from 'boot/axios'
import authHeader from './auth-header'

class UserService {
    getPublicContent() {
      return api.get('/api/test/all');
    }
  
    getUserBoard() {
      return api.get('/api/test/user', { headers: authHeader() });
    }
  
    getModeratorBoard() {
      return api.get('/api/test/mod', { headers: authHeader() });
    }
  
    getAdminBoard() {
      return api.get('/api/test/admin', { headers: authHeader() });
    }
  }
  
  export default new UserService();