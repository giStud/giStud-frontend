import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class UnivRequestService {
  async createNewUnivRequest(email, text) {
    await api.post("/univRequests/", {
      email,
      text,
    })
  }

  async getUnivRequests() {
    try {
      const {data} = await api.get("/univRequests", {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }

  async deleteUnivRequestById(univId) {
    try {
      console.log(univId)
      const {data} = await api.delete("/univRequests/" + univId, {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new UnivRequestService();
