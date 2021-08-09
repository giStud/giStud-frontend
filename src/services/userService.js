import {api} from 'boot/axios'
import authHeader from './authHeader'

class UserService {
    getPublicContent() {
      return api.get('/api/test/all');
    }
  }

export default new UserService();
