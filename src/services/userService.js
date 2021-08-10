import {api} from 'boot/axios'

class UserService {
    getPublicContent() {
      //return api.get('/api/test/all', {headers: authHeader()});
    }
  }

export default new UserService();
