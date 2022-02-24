import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class GroupService {
  async getGroups() {
    const {data} = await api.get("/groups")
    return data;
  }

  async getGroupNameById(groupId) {
    const {data} = await api.get("/groups/groupName?groupId=" + groupId)
    return data;
  }

  async getGroupNamesByUniv(univId) {
    try {
      const {data} = await api.get("/groups/groupNames?univId=" + univId);
      return data;
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

  async createGroup(group, semester) {
    try {
      const {data} = await api.post("/groups/createEmptySchedule", {
        facId : group.faculty.facId,
        groupName : group.name,
        timeArray : group.timeArray,
        semester
      }, {headers: authHeader()})
    } catch (e) {
      throw e;
    }
  }
}

export default new GroupService();
