import {api} from "boot/axios";

class NewsService {
  async getNewsPage(pageNumber) {
    try {
      const {data} = await api.get("/news", {
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
      const {data} = await api.get("/news/filterByType", {
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
}

export default new NewsService();
