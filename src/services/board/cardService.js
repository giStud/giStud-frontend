import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

const API_URL = '/v1/cards';

class CardService {
  async create({title, category, description, dateTo, dateFrom, logoFile,
                 tags, contactPhone, contactMail}) {
    try {
      let formData = new FormData();
      const card = {
        name: title,
        description: description,
        startDate: dateFrom ? `${dateFrom}:00` : null,
        finishDate: dateTo ? `${dateTo}:00` : null,
        contactMail: contactMail,
        contactPhone: contactPhone,
        category: category,
        tags: tags
      }
      const json = JSON.stringify(card);
      const blob = new Blob([json], {
        type: 'application/json'
      });
      formData.append("card", blob);
      formData.append("logo", logoFile);
      console.log(formData)
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

}

export default new CardService();
