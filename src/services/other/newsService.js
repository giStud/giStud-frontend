import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

class NewsService {
  async saveNews(title, img, shortText, fullText) {
    try {
      return await api.post("/news/", {
        title,
        shortText,
        imgSrc : img,
        text : fullText
      }/*, {headers: authHeader()}*/)
    } catch (e) {
      throw e
    }
  }

  async getNews() {
    try {
      const {data} = await api.get("/news")
      return data;
    } catch (e) {
      throw e;
    }
  }

  async deleteNewsEntityById(newsId) {
    try {
      const {data} = await api.delete("/news/" + newsId/*, {headers: authHeader()}*/)
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new NewsService();
