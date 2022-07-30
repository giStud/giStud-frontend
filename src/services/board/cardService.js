import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";
import {date} from "quasar";

const API_URL = '/v1/cards';

export const CARD_STATUS = {
  CREATING : 'CREATING',
  WAITING_APPROVAL : 'WAITING_APPROVAL',
  APPROVED : 'APPROVED',
  BANNED : 'BANNED'
}

class CardService {
  async update({card, newLogo, newAttachments, attachmentsToDelete}) {
    try {
      let formData = new FormData();
      const payload = {...card};
      date.formatDate(payload.createdDate, 'YYYY-MM-DD HH:mm:ss');
      const cardBlob = new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      });
      if (attachmentsToDelete && attachmentsToDelete.length !== 0) {
        const attachmentsToDeleteBlob = new Blob([JSON.stringify(attachmentsToDelete)], {
          type: 'application/json'
        });
        formData.append("attachmentsToDelete", attachmentsToDeleteBlob)
      }
      formData.append("card", cardBlob);
      formData.append("newLogo", newLogo);
      if (newAttachments && newAttachments.length !== 0) {
        Array.from(newAttachments).forEach(file => formData.append(`newAttachments`, file))
      }
      const {data} = await api.put(`${API_URL}`, formData, {
        headers: {
          "Content-Type":"multipart/form-data",
          ...authHeader()
        }
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async create({card, logoFile, attachments}) {
    try {
      let formData = new FormData();
      const payload = {...card};
      const json = JSON.stringify(payload);
      const blob = new Blob([json], {
        type: 'application/json'
      });
      formData.append("card", blob);
      formData.append("logo", logoFile);
      if (attachments && attachments.length !== 0) {
        Array.from(attachments).forEach(file => formData.append(`attachments`, file))
      }
      const {data} = await api.post(`${API_URL}`, formData, {
        headers: {
          "Content-Type":"multipart/form-data",
          ...authHeader()
        }
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async updateStatus(id, newStatus) {
    try {
      const {data} = await api.put(`${API_URL}/${id}/update-status`, {
        newStatus
      }, {
        headers: authHeader()
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getCardPage(payload) {
    try {
      const {data} = await api.get(`${API_URL}/page`, {
        params: payload
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getCardById(id) {
    try {
      const {data} = await api.get(`${API_URL}/${id}`);
      return data;
    } catch (e) {
      throw e;
    }
  }

  async deleteCardById(id) {
    try {
      await api.delete(`${API_URL}/${id}`, {
        headers: {
          ...authHeader()
        }
      });
    } catch (e) {
      throw e;
    }
  }
}

export default new CardService();
