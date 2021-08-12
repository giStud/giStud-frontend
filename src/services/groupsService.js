import {api} from "boot/axios"
import authHeader from "./authHeader";

class GroupService {
    async getGroups () {
        const {data} = await api.get("/groups")
        return data;
    }

    async getGroupNames () {
        const {data} = await api.get("/groups/groupNames")
        return data;
    }

    async getGroupByNameAndUniv (groupName) {
        try {
            const {data} = await api.get("/groups/group?groupName=" + groupName/*, {headers: authHeader()}*/)
            return data;
        } catch(e) {
            throw e
        }

    }
}

export default new GroupService();
