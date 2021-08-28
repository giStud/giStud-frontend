import GroupService from '../../services/schedule/groupsService';
import UniversityService from '../../services/schedule/universityService';

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

export async function getGroupNamesByUnivAction({commit}, {univId}) {
  try {
    const data = await GroupService.getGroupNamesByUniv(univId)
    commit('setGroupNames', data)
    return data;
  } catch (e) {
    throw e;
  }
}
