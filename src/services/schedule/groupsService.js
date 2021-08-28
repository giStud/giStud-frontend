import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class GroupService {
  async getGroups() {
    const {data} = await api.get("/groups")
    return data;
  }

  async getGroupNamesByUniv(univId) {
    //TODO: check on SQL inject
    try {
      const {data} = await api.get("/groups/groupNames?univId=" + univId);
      return data.groups;
    } catch (e) {
      throw e;
    }
  }

  async getGroupById(grId) {
    try {
      const {data} = await api.get("/groups/" + grId)
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new GroupService();
