import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

const API_URL = '/v1/card-categories';

class CardAttachmentService {
  async findAll() {
    try {
      const {data} = await api.get(`${API_URL}`);
      return data;
    } catch (e) {
      throw e;
    }
  }

}

export default new CardAttachmentService();
