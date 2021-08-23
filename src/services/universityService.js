import {api} from "boot/axios"
import authHeader from "./authHeader";

class UniversityService {
  async getUnivNames() {
    const {data} = await api.get("/universities/universitiesNames")
    return data.universities;
  }
}

export default new UniversityService;
