import {api} from "boot/axios"
import authHeader from "../auth/authHeader";
import {getLessonNumeratorByWeeks, getWeeksArrayByLessons} from "src/composables/schedule/ScheduleTable";
import {arraysEqual} from "src/services/other/tools";

class LessonService {
  async getLessonEditInfoById(lessonId) {
    try {
      const {data} = await api.get("/lessons/getLessonInfo/" + lessonId, {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getLessonTypes() {
    try {
      const {data} = await api.get("/lessons/types",{headers: authHeader()});
      return data;
    } catch (e) {
      throw e;
    }
  }

  async changeLessonsByNewValues(lessonsToChange, newValuesObj) {
    if (lessonsToChange.length !== 0) {
      const lessonToExample = lessonsToChange[0];
      const newLessonName = newValuesObj.editLessonName !== lessonToExample.name ? newValuesObj.editLessonName : null;
      const newRawLessonString = newValuesObj.editRawLessonString !== lessonToExample.rawLessonString ? newValuesObj.editRawLessonString : null;
      const newStartTime = newValuesObj.editLessonStartTime !== lessonToExample.startTime.substr(0,5) ? newValuesObj.editLessonStartTime : null;
      const newFinishTime = newValuesObj.editLessonFinishTime !== lessonToExample.finishTime.substr(0,5) ? newValuesObj.editLessonFinishTime : null;
      const newDay = newValuesObj.editLessonDay !== lessonToExample.day ? newValuesObj.editLessonDay : null;
      const newAudience = newValuesObj.editLessonAudience !== lessonToExample.audienceEntity.audience ? newValuesObj.editLessonAudience : null;
      const newType = newValuesObj.editLessonType.typeName !== lessonToExample.typeEntity.typeName ? newValuesObj.editLessonType : null;

      const lessonsNumerator = getLessonNumeratorByWeeks(lessonsToChange);
      let newNumerator = newValuesObj.editLessonNumerator !== lessonsNumerator ? newValuesObj.editLessonNumerator : null;

      let newWeeks = null;
      if (newValuesObj.editLessonSelectedWeeks && newValuesObj.editLessonSelectedWeeks.length !== 0) {
        newWeeks = newValuesObj.editLessonSelectedWeeks;
        newNumerator = 'CUSTOM';
      }

      const semesterType = newValuesObj.editLessonSemesterType;

      try {
        const {data} = await api.put("/lessons",{
          lessonsToChange,
          newLessonName,
          newRawLessonString,
          newStartTime,
          newFinishTime,
          newDay,
          newAudience,
          newType,
          newNumerator,
          newWeeks,
          semesterType
        },{headers: authHeader()});
        return data;
      } catch (e) {
        throw e;
      }
    } else {
      return null;
    }
  }

  async deleteLesson(lessonsToDelete) {
    let result = [];
    for (let lesson of lessonsToDelete) {
      result.push(lesson.lessonId);
    }
    if (lessonsToDelete.length !== 0) {
      try {
        await api.delete("/lessons?lessonToDelete=" + result,{headers: authHeader()});
      } catch (e) {
        throw e;
      }
    }
  }
}

export default new LessonService();
