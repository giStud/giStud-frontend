import GroupService from '../../services/groupsService';

export async function getGroupByNameAndUnivAction ({commit}, {groupName}) {
    try {
        const data = await GroupService.getGroupByNameAndUniv(groupName)
        commit('setSelectedGroup', data)
        return data;
    } catch (e) {
        throw e
    }
    
}
