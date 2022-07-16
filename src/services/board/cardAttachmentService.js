import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

const API_URL = '/v1/card-attachments';

class CardAttachmentService {
  async downloadAttachmentById(id) {
    try {
      return await api.get(`${API_URL}/${id}/download`, {
        responseType: "arraybuffer"
      })
    } catch (e) {
      throw e;
    }
  }

}

export default new CardAttachmentService();
