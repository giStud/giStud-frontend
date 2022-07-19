import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

const API_URL = '/v1/cards';

export const CARD_STATUS = {
  CREATING : 'CREATING',
  WAITING_APPROVAL : 'WAITING_APPROVAL',
  APPROVED : 'APPROVED',
  BANNED : 'BANNED'
}

class CardService {
  async update({card, newLogo, newAttachments, attachmentsToDelete}) {

  }

  async create({card, logoFile, attachments}) {
    try {
      let formData = new FormData();
      const payload = {...card};
      if (payload.startDate) {
        payload.startDate = payload.startDate + ":00";
      }
      if (payload.finishDate) {
        payload.finishDate = payload.finishDate + ":00";
      }
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
}

export default new CardService();
