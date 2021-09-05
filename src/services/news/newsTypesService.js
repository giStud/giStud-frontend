import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

class NewsTypeService {
  async saveNewsType(type) {
    try {
      return await api.post("/newsTypes/", {
        type
      }, {headers: authHeader()})
    } catch (e) {
      throw e
    }
  }

  async getNewsTypes() {
    try {
      const {data} = await api.get("/newsTypes/")
      return data;
    } catch (e) {
      throw e;
    }
  }

  async deleteNewsTypeById(typeId) {
    try {
      const {data} = await api.delete("/newsTypes/" + typeId, {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new NewsTypeService();
