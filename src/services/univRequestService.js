import {api} from "boot/axios"
import authHeader from "./authHeader";

class UnivRequestService {
  async createNewUnivRequest(email, text) {
    await api.post("/univRequests/", {
      email,
      text,
    })
  }
}

export default new UnivRequestService();
