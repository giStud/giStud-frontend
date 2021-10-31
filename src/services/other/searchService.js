import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class SearchService {
  async getResult(searchedString) {
    const {data} = await api.get("/search?stringToFound=" + searchedString)
    return data;
  }
}

export default new SearchService();
