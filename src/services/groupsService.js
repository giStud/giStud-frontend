import {api} from "boot/axios"

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
            const {data} = await api.get("/groups/group?groupName=" + groupName)
            return data;
        } catch(e) {
            console.log("Упали в груп сервисе");
            throw e
        }
        
    }
}

export default new GroupService();