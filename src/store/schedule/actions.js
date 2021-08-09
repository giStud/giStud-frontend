import GroupService from '../../services/groupsService';

export async function getGroupByNameAndUnivAction ({commit}, {groupName}) {
    console.log("/groups/group?groupName=" + groupName);
    const data = await GroupService.getGroupByNameAndUniv(groupName)
    console.log(data);
    commit('setSelectedGroup', data)
    return data;
}
