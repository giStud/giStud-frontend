import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class TaskService {
  async createScheduleTask(task) {
    try {
      const {data} = await api.post("/schedule/autoUpdateTask", task, {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new TaskService();
