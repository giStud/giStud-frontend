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

export async function getGroupById ({commit}, {grId}) {
  try {
    const data = await GroupService.getGroupById(grId)
    commit('setSelectedGroup', data)
    return data;
  } catch (e) {
    throw e
  }
}

export async function getGroupLessonsById ({commit}, {grId}) {
  try {
    const data = await GroupService.getGroupLessonsById(grId)
    //commit('setSelectedGroup', data)
    return data;
  } catch (e) {
    throw e
  }
}
