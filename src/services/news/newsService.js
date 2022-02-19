import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

class NewsService {
  async getNewsPage(pageNumber) {
    try {
      const {data} = await api.get("/news/page", {
        params: {
          pageNumber,
        },
      })
      return data
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async getNewsPageByType(pageNumber, typeId) {
    try {
      const {data} = await api.get("/news/page/filterByType", {
        params: {
          pageNumber,
          typeId
        },
      })
      return data
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async getNewsItemById(newsId) {
    try {
      const {data} = await api.get("/news/" + newsId)
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getAllNews() {
    try {
      const {data} = await api.get("/news/all",{headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new NewsService();
