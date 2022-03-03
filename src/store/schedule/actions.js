import LessonsService from '../../services/schedule/lessonService';
import GroupService from '../../services/schedule/groupsService';
import UniversityService from '../../services/schedule/universityService';
import FacultyService from '../../services/schedule/facultyService'
import TaskService from '../../services/schedule/taskService';
import {setFaculties} from "src/store/schedule/mutations";

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

export async function createFacultyAction({commit}, payload) {
  const data = await FacultyService.createFaculty(payload);
  commit('addFacultyName', data);
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
    const data = await FacultyService.getFacultiesByUniv(univId)
    commit('setFaculties', data)
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

export async function createNewScheduleTask({commit}, task) {
  const data = await TaskService.createScheduleTask(task);
  console.log(data);
}
