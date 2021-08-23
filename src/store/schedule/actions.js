import GroupService from '../../services/groupsService';
import UniversityService from '../../services/universityService';

export async function getGroupByNameAndUnivAction({commit}, {groupName}) {
  try {
    const data = await GroupService.getGroupByNameAndUniv(groupName)
    commit('setSelectedGroup', data)
    return data;
  } catch (e) {
    throw e
  }
}

export async function getGroupById({commit}, {grId}) {
  try {
    const data = await GroupService.getGroupById(grId)
    commit('setSelectedGroup', data)
    return data;
  } catch (e) {
    throw e;
  }
}

export async function getUniversitiesNamesAction({commit}) {

  const data = await UniversityService.getUnivNames();
  commit('setUnivNames', data);
  return data;
}

export async function getGroupNamesAction({commit}) {
  const data = await GroupService.getGroupNames()
  commit('setGroupNames', data)
  return data;
}
