import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

const API_URL = '/v1/card-attachments';

class CardAttachmentService {
  async downloadAttachmentById(id) {
    try {
      const {data, headers} = await api.get(`${API_URL}/${id}/download`, {
        responseType: "arraybuffer"
      });
      const contentDisposition = headers['content-disposition'];
      const fileName = contentDisposition.split(';')[1].trim().split('=')[1].replaceAll('\'', '');
      return {byteArray : data, fileName};
    } catch (e) {
      throw e;
    }
  }

  async addAttachmentToCard(id, file, type) {
      try {
        let formData = new FormData();
        const blob = new Blob([type], {
          type: 'text/plain'
        });
        formData.append("type", blob);
        formData.append("file", file);
        const headers = authHeader();
        headers['Content-Type'] = 'multipart/form-data';
        const {data} = await api.post(`${API_URL}/${id}/upload-attachment`, formData, {
          headers: headers
        });
        return data;
      } catch (e) {
        throw e;
      }
  }

  async addAttachmentsToCard(id, files, type) {
    try {
      let formData = new FormData();
      const blob = new Blob([type], {
        type: 'text/plain'
      });
      formData.append("type", blob);
      Array.from(files).forEach(file => formData.append(`files`, file))
      const headers = authHeader();
      headers['Content-Type'] = 'multipart/form-data';
      const {data} = await api.post(`${API_URL}/${id}/upload-attachments`, formData, {
        headers: headers
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getCardAttachments(id, type) {
    try {
      const {data} = await api.get(`${API_URL}/card/${id}`, {
        params: {
          type
        }
      });
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new CardAttachmentService();
