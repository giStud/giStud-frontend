import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class LessonService {
  async getLessonEditInfoById(lessonId) {
    try {
      const {data} = await api.get("/lessons/getLessonInfo/" + lessonId, {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getLessonTypes() {
    try {
      const {data} = await api.get("/lessons/types",{headers: authHeader()});
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new LessonService();
