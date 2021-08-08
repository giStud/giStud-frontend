import {api} from 'boot/axios'
export async function getGroupsAction ({commit}) {
    const {data} = await api.get("/groups")
    commit('setGroups', data)
}

export async function getGroupNamesAction ({commit}) {
    const {data} = await api.get("/groups/groupNames")
    commit('setGroupNames', data)
}
