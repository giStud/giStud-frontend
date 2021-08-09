import {api} from 'boot/axios'
import authHeader from './auth-header'

class UserService {
    getPublicContent() {
      return api.get('/api/test/all');
    }
  }

export default new UserService();
