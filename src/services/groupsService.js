import {api} from "boot/axios"
import authHeader from "./authHeader";

class GroupService {
  async getGroups() {
    const {data} = await api.get("/groups")
    return data;
  }

  async getGroupNamesByUniv(univId) {
    //TODO: check on SQL inject
    const {data} = await api.get("/groups/groupNames?univId=" + univId);
    return data.groups;
  }

  async getGroupByNameAndUniv(groupName) {
    try {
      const {data} = await api.get("/groups/group?groupName=" + groupName/*, {headers: authHeader()}*/)
      return data;
    } catch (e) {
      throw e
    }

  }

  async getGroupById(grId) {
    try {
      const {data} = await api.get("/groups/" + grId)
      return data;
    } catch (e) {
      throw e
    }
  }
}

export default new GroupService();
