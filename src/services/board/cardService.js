import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

const API_URL = '/v1/card';

class CardService {
  async create({title, category, description, dateTo, dateFrom, logoFile,
                 tags, contactPhone, contactMail}) {
    try {
      let formData = new FormData();
      const card = {
        name: title,
        description: description,
        startDate: dateFrom,
        finishDate: dateTo,
        contactMail: contactMail,
        contactPhone: contactPhone,
        category: category,
        tags: tags
      }
      formData.append("card", JSON.stringify(card));
      formData.append("logo", logoFile);

      const {data} = await api.post(`${API_URL}`, formData);
      return data;
    } catch (e) {
      throw e;
    }
  }

}

export default new CardService();
