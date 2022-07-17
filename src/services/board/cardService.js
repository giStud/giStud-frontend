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
  async create({card, logoFile}) {
    try {
      let formData = new FormData();
      /*const card = {
        name: name,
        description: description,
        startDate: startDate,
        finishDate: finishDate,
        contactMail: contactMail,
        contactPhone: contactPhone,
        category: category,
        tags: tags
      }*/
      console.log(card)
      const json = JSON.stringify(card);
      const blob = new Blob([json], {
        type: 'application/json'
      });
      formData.append("card", blob);
      formData.append("logo", logoFile);
      const headers = authHeader();
      headers['Content-Type'] = 'multipart/form-data';
      const {data} = await api.post(`${API_URL}`, formData, {
        headers: headers
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
