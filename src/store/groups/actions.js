import GroupService from '../../services/groupsService';

export async function getGroupsAction ({commit}) {
    const data = await GroupService.getGroups()
    commit('setGroups', data)
    return data;
}

export async function getGroupNamesAction ({commit}) {
    const data = await GroupService.getGroupNames()
    commit('setGroupNames', data)
    return data;
}
