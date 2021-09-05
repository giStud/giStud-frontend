import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class UserMessagesService {
  async createUserMessage(email, text, url) {
    await api.post(url, {
      email,
      text,
    })
  }

  async getUserMessages() {
    try {
      const {data} = await api.get("/userMessages"/*, {headers: authHeader()}*/)
      return data;
    } catch (e) {
      throw e;
    }
  }

  async deleteUserMessageById(univId) {
    try {
      console.log(univId)
      const {data} = await api.delete("/userMessages/" + univId/*, {headers: authHeader()}*/)
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new UserMessagesService();
