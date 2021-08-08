import {api} from 'boot/axios'

export async function getGroupByNameAndUnivAction ({commit}, {groupName}) {
    console.log("/groups/group?groupName=" + groupName);
    const {data} = await api.get("/groups/group?groupName=" + groupName)
    console.log(data);
    commit('setSelectedGroup', data)
}
