import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class UniversityService {
  async getUnivNames() {
    const {data} = await api.get("/universities/universitiesNames")
    return data.universities;
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
