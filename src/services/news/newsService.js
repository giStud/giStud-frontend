import {api} from "boot/axios";
import authHeader from "src/services/auth/authHeader";

class NewsService {
  async saveNews(title, img, shortText, fullText, source, typeId) {
    try {
      return await api.post("/news/", {
        title,
        shortText,
        imgSrc: img,
        text: fullText,
        source,
        typeId
      }, {headers: authHeader()})
    } catch (e) {
      throw e
    }
  }

  async updateNewsEntity(id, newValue) {
    const type = newValue.type;
    let typeId = null;
    if (type) {
      typeId = type.newsTypeId;
    }
    try {
      const {data} = await api.put("/news/" + id,
        {
          title : newValue.newsTitle,
          shortText : newValue.newsShortText,
          text : newValue.newsText,
          imgSrc : newValue.newsImgSrc,
          source : newValue.newsSource,
          typeId : typeId
        },{headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }

  async deleteNewsEntityById(newsId) {
    try {
      const {data} = await api.delete("/news/" + newsId, {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }

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
