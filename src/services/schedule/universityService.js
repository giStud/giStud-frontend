import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class UniversityService {
  async createUniversity(name, cityName) {
    const {data} = await api.post("/universities?name=" + name + "&cityName=" + cityName, {headers: authHeader()});
    return data;
  }

  async getUnivNameById(univId) {
    const {data} = await api.get("/universities/univName?univId=" + univId)
    return data;
  }

  async getUnivNames() {
    const {data} = await api.get("/universities/universitiesNames")
    return data;
  }

  async getFacNames(univId) {
    try {
      const {data} = await api.get("/universities/facNames/" + univId);
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new UniversityService;
