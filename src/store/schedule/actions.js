import LessonsService from '../../services/schedule/lessonService';
import GroupService from '../../services/schedule/groupsService';
import UniversityService from '../../services/schedule/universityService';

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

export async function createUniversityAction({commit}, {name, cityName}) {
  const data = await UniversityService.createUniversity(name, cityName);
  commit('addUnivName', data);
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

export async function getFacNamesByUnivAction({commit}, {univId}) {
  try {
    const data = await UniversityService.getFacNames(univId)
    commit('setFacNames', data)
    return data;
  } catch (e) {
    throw e;
  }
}

export async function getLessonTypes({commit}) {
  const data = await LessonsService.getLessonTypes();
  commit('setLessonTypes', data);
  return data;
}
