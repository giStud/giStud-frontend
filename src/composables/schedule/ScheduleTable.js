import UtilsService from '../../services/other/utilsService'
import {theme} from "src/services/other/tools";
import {Dark} from "quasar";
import Login from "components/Login";
import {arraysEqual} from '../../services/other/tools'

const autumnLimit = 23;
const springLimit = 45;

const debugTimeArray = [
  {
    lessonBeginTime: '08:00',
    lessonFinishTime: '09:35'
  },
  {
    lessonBeginTime: '09:45',
    lessonFinishTime: '11:20'
  },
  {
    lessonBeginTime: '11:30',
    lessonFinishTime: '13:05'
  },
  {
    lessonBeginTime: '13:30',
    lessonFinishTime: '15:05'
  },
  {
    lessonBeginTime: '15:15',
    lessonFinishTime: '16:50'
  },
  {
    lessonBeginTime: '17:00',
    lessonFinishTime: '18:35'
  },
]

export function getScheduleInfoByWeekDesktop(lessons, week) {
  let scheduleInfoObject = {}
  let twinRows = [];
  let maxTwinLessonLength = 0;

  let maxLesson = {
    name : '',
    rawLessonString : ''
  };
  let maxLessonDouble = {
    name : '',
    rawLessonString: ''
  };

  const daysArray = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const numerator = getTypeOfWeek(week);
  let lessonsOfSelectedWeek = [];
  for (let lesson of lessons) {

    if (lesson.week === week) {
      lessonsOfSelectedWeek.push(lesson);
    }
  }

  let rowsArray = []
  if (lessonsOfSelectedWeek.length !== 0) {
    for (let indexOfDaysArray = 0; indexOfDaysArray < daysArray.length; indexOfDaysArray++) {
      let dayObject = {}
      let lessonsArray = [];
      const day = daysArray[indexOfDaysArray];
      const filteredByDayLessons = filterLessonsByDay(day, lessonsOfSelectedWeek);
      const timeArray = getTimeArrayByLessons(filteredByDayLessons);


      for (let indexOfTimeArray = 0; indexOfTimeArray < timeArray.length; indexOfTimeArray++) {
        let timeObject = timeArray[indexOfTimeArray];
        let lessonObject = {}
        lessonObject['time'] = timeObject;
        lessonObject['value'] = [];
        lessonsArray[indexOfTimeArray] = lessonObject;
      }
      dayObject['day'] = day;
      dayObject['lessons'] = lessonsArray;
      rowsArray[indexOfDaysArray] = dayObject;
    }

    for (let lesson of lessonsOfSelectedWeek) {
      let time = lesson.startTime.substr(0, 5);
      const lessonNumerator = lesson.numerator;

      for (let rowObject of rowsArray) {
        if (lesson.day === rowObject.day) {
          for (let i = 0; i < rowObject.lessons.length; i++) {
            let lessonVal = rowObject.lessons[i];
            if (lessonVal.time.lessonBeginTime === time && (lessonNumerator === numerator || lessonNumerator === 'FULL')) {
              maxLesson.name = lesson.name.length > maxLesson.name.length ? lesson.name : maxLesson.name;
              maxLesson.rawLessonString = lesson.rawLessonString.length > maxLesson.rawLessonString.length ? lesson.rawLessonString : maxLesson.rawLessonString;
              if (lesson.name !== '') {
                if (lessonVal.value.length !== 0) {
                  if (lessonVal.value[0].name === '') {
                    lessonVal.value[0] = lesson;
                  } else {
                    maxLessonDouble.name = lesson.name.length > maxLessonDouble.name.length ? lesson.name : maxLessonDouble.name;
                    maxLessonDouble.rawLessonString = lesson.rawLessonString.length > maxLessonDouble.rawLessonString.length ? lesson.rawLessonString : maxLessonDouble.rawLessonString;
                    lessonVal.value.push(lesson);
                    twinRows.push(i);
                  }
                } else {
                  lessonVal.value.push(lesson);
                }
              } else if (lessonVal.value.length === 0) {
                lessonVal.value.push(lesson);
              }
            }
          }
        }
      }
    }
  } else {
    for (let indexOfDaysArray = 0; indexOfDaysArray < daysArray.length; indexOfDaysArray++) {
      let dayObject = {}
      let lessonsArray = [];
      for (let indexOfTimeArray = 0; indexOfTimeArray < debugTimeArray.length; indexOfTimeArray++) {
        let timeObject = debugTimeArray[indexOfTimeArray];
        let lessonObject = {}
        lessonObject['time'] = timeObject;
        lessonObject['value'] = [];
        lessonsArray[indexOfTimeArray] = lessonObject;
      }
      dayObject['day'] = daysArray[indexOfDaysArray];
      dayObject['lessons'] = lessonsArray;
      rowsArray[indexOfDaysArray] = dayObject;
    }
  }
  scheduleInfoObject['daysArray'] = rowsArray;
  scheduleInfoObject['twinRows'] = twinRows;
  scheduleInfoObject['maxTwinLessonLength'] = maxTwinLessonLength;
  scheduleInfoObject['maxLesson'] = maxLesson;
  scheduleInfoObject['maxLessonDouble'] = maxLessonDouble;
  return scheduleInfoObject;
}

function filterLessonsByDay(day, lessons) {
  let filteredLessons = [];
  for (let lesson of lessons) {
    if (lesson.day === day) {
      filteredLessons.push(lesson);
    }
  }
  return filteredLessons;
}

function getTimeArrayByLessons(lessons) {
  let timeArray = [];
  for (let lesson of lessons) {
    timeArray.push({
      lessonBeginTime: lesson.startTime.substr(0, 5),
      lessonFinishTime: lesson.finishTime.substr(0, 5)
    });
  }
  timeArray.sort((a, b) => a.lessonBeginTime.localeCompare(b.lessonBeginTime));
  timeArray = Array.from(new Set(timeArray.map(JSON.stringify))).map(JSON.parse);

  return timeArray;
}

export function getLessonFromSelectedDateMobile(lessons, date) {
  const currentDayOfWeek = getWeekDayStringFromDate(date);
  const selectedWeek = getNumberOfWeek(getDateOfMonday(date));

  let lessonsOfSelectedWeek = [];
  for (let lesson of lessons) {
    if (lesson.week === selectedWeek) {
      lessonsOfSelectedWeek.push(lesson);
    }
  }

  let rowsArray = []
  if (lessonsOfSelectedWeek.length !== 0) {
    let timeArray = [];
    for (let lesson of lessonsOfSelectedWeek) {
      timeArray.push({
        lessonBeginTime: lesson.startTime.substr(0, 5),
        lessonFinishTime: lesson.finishTime.substr(0, 5)
      });
    }

    timeArray.sort((a, b) => a.lessonBeginTime.localeCompare(b.lessonBeginTime));
    timeArray = Array.from(new Set(timeArray.map(JSON.stringify))).map(JSON.parse);


    let filteredLessonsByDay = []
    for (let lesson of lessonsOfSelectedWeek) {
      if (lesson.day === currentDayOfWeek) {
        filteredLessonsByDay.push(lesson);
      }
    }

    for (let indexOfTimeArray = 0; indexOfTimeArray < timeArray.length; indexOfTimeArray++) {
      let rowObject = {}
      rowObject['lessonNumber'] = indexOfTimeArray + 1;
      rowObject['time'] = timeArray[indexOfTimeArray]
      rowObject['lessons'] = [];
      rowsArray[indexOfTimeArray] = rowObject
    }

    const numerator = getTypeOfWeek(selectedWeek);

    for (let lesson of filteredLessonsByDay) {
      let time = lesson.startTime.substr(0, 5);
      const lessonNumerator = lesson.numerator;


      for (let rowObject of rowsArray) {
        if (rowObject.time.lessonBeginTime === time && (lessonNumerator === numerator || lessonNumerator === 'FULL')) {
          let lessonsFromRow = rowObject['lessons'];
          if (lesson.name !== '') {
            if (lessonsFromRow.length !== 0) {
              if (lessonsFromRow[0].name === '') {
                lessonsFromRow[0] = lesson;
              } else {
                lessonsFromRow.push(lesson);
              }
            } else {
              lessonsFromRow.push(lesson);
            }
          } else if (lessonsFromRow.length === 0) {
            lessonsFromRow.push(lesson);
          }
        }
      }
    }
  } else {
    for (let indexOfTimeArray = 0; indexOfTimeArray < debugTimeArray.length; indexOfTimeArray++) {
      let rowObject = {}
      rowObject['lessonNumber'] = indexOfTimeArray + 1;
      rowObject['time'] = debugTimeArray[indexOfTimeArray]
      rowObject['lessons'] = [];
      rowsArray[indexOfTimeArray] = rowObject
    }
  }

  return rowsArray;
}

export function getTableRowsFromLessonsMobile(lessons, week, day) {
  let timeArray = [];
  const numerator = getTypeOfWeek(week);
  let lessonsOfSelectedWeek = [];
  for (let lesson of lessons) {
    if (lesson.week === week) {
      lessonsOfSelectedWeek.push(lesson);
    }
  }

  for (let lesson of lessonsOfSelectedWeek) {
    if (lesson.day === 'MONDAY') {
      timeArray.push(lesson.time);
    }
    if (lesson.day === 'TUESDAY') {
      timeArray.push(lesson.time);
    }
  }
  timeArray.sort();
  timeArray = Array.from(new Set(timeArray));

  for (let time in timeArray) {
    let timeValue = timeArray[time];
    const timeSplittedArray = timeValue.split(":");
    let tempDate = new Date();
    tempDate.setHours(timeSplittedArray[0], timeSplittedArray[1]);
    let lessonBeginTime = UtilsService.getTimeString(tempDate);

    tempDate.setHours(tempDate.getHours() + 1);
    tempDate.setMinutes(tempDate.getMinutes() + 35)

    let lessonFinishTime = UtilsService.getTimeString(tempDate);

    timeArray[time] = {
      lessonBeginTime,
      lessonFinishTime
    }
  }

  let filteredLessonsByDay = []
  for (let lesson of lessonsOfSelectedWeek) {
    if (lesson.day === day) {
      filteredLessonsByDay.push(lesson);
    }
  }

  let rowsArray = []
  for (let indexOfTimeArray = 0; indexOfTimeArray < timeArray.length; indexOfTimeArray++) {
    let rowObject = {}
    rowObject['rowNum'] = indexOfTimeArray;
    rowObject['time'] = timeArray[indexOfTimeArray]
    rowObject['lessons'] = [];
    rowsArray[indexOfTimeArray] = rowObject
  }

  for (let lesson of filteredLessonsByDay) {
    let time = lesson.time.substr(0, 5);
    const lessonNumerator = lesson.numerator;


    for (let rowObject of rowsArray) {
      if (rowObject.time.lessonBeginTime === time && (lessonNumerator === numerator || lessonNumerator === 'FULL')) {
        let lessonsFromRow = rowObject['lessons'];
        if (lesson.name !== '') {
          if (lessonsFromRow.length !== 0) {
            if (lessonsFromRow[0].name === '') {
              lessonsFromRow[0] = lesson;
            } else {
              lessonsFromRow.push(lesson);
            }
          } else {
            lessonsFromRow.push(lesson);
          }
        } else if (lessonsFromRow.length === 0) {
          lessonsFromRow.push(lesson);
        }
      }
    }
  }
  return rowsArray;
}

export function getDateString(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear().toString().substr(2);
  return (day < 10 ? '0' + day : day) + '.' +
    (month < 10 ? '0' + month : month) + '.' + year;
}

export function getDateOfMonday(date) {
  let tempDate = new Date(date);
  let dayWeek = [7, 1, 2, 3, 4, 5, 6][tempDate.getDay()];
  tempDate.setDate(tempDate.getDate() - (dayWeek - 1));

  return tempDate;
}

export function getTypeOfWeekFromDate(date) {
  if (getNumberOfWeek(date) % 2 === 0) {
    return 'DENOMINATOR';
  } else {
    return 'NUMERATOR';
  }
}

export function getTypeOfWeek(week) {
  if (week % 2 === 0) {
    return 'DENOMINATOR';
  } else {
    return 'NUMERATOR';
  }
}

export function getStartDateOfWeek(week, year) {
  let weekCounter = 1;
  let startDate = new Date(year, 8, 1);

  while (weekCounter < week) {
    if (startDate.getDay() === 0) {
      weekCounter++;
    }
    startDate.setDate(startDate.getDate() + 1);
  }

  return getDateOfMonday(startDate);
}

export function getNumberOfWeek(date) {

  //IDFK WTF WITH THIS SHIT P.s: calculate first week
  let tempDate = new Date(date);
  const tempSeptemberDate = new Date(tempDate.getFullYear(), 8, 1)
  if (tempDate < tempSeptemberDate) {
    for (let i = 0; i < 7; i++) {
      tempDate.setDate(tempDate.getDate() + 1);
      if (tempDate >= tempSeptemberDate) {
        return 1;
      }
    }
  }

  let weekCounter = 1;
  let year;
  if (date.getMonth() >= 8) {
    year = date.getFullYear();
  } else {
    year = date.getFullYear() - 1;
  }

  //1 september
  let startDate = new Date(year, 8, 1);

  while (startDate < date) {
    if (startDate.getDay() === 0) {
      weekCounter++;
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  return weekCounter;
}

export function getScheduleCellColor(dayObject) {
  if (dayObject && dayObject.typeEntity) {
    const typeName = dayObject.typeEntity.typeName;
    return getTypeColorByValue(typeName);
  }
  return 'background-color: gray'
}

export function isCurrentLessonGoes(selectedWeek, lesson, lessonBeginTime, lessonFinishTime) {
  if (!lesson) {
    return false;
  }

  if (lesson.name === '' || lesson.rawLessonString === '') {
    return false;
  }

  const lessonDay = lesson.day;
  const currentDate = new Date();
  const currentDay = getWeekDayStringFromDate(currentDate);
  //const currentDate = new Date(2021,8,6,8,20);
  //const currentDay = 'MONDAY';
  const currentWeek = getNumberOfWeek(currentDate);

  if (currentWeek === selectedWeek && currentDay === lessonDay) {
    const beginLessonArray = lessonBeginTime.split(":");
    const finishLessonArray = lessonFinishTime.split(":");
    let startDate = new Date();
    // let startDate = new Date(2021,9,5,15,35);
    startDate.setHours(beginLessonArray[0])
    startDate.setMinutes(beginLessonArray[1])
    startDate.setSeconds(0);
    let finishDate = new Date();
    // let finishDate = new Date(2021,9,5,15,50);
    finishDate.setHours(finishLessonArray[0])
    finishDate.setMinutes(finishLessonArray[1])
    startDate.setSeconds(0);

    return currentDate >= startDate && currentDate <= finishDate;
  } else {
    return false;
  }
}

export function isSelectedUnivEgu(univObj) {
  if (univObj && univObj.univName) {
    const univName = univObj.univName;
    return univName === '??????'
  }
  return false;
}

export function getLessonNumeratorByWeeks(lessons, semester) {
  if (lessons.length !== 0) {
    const weeksArray = getWeeksArrayByLessons(lessons);
    return getNumeratorByWeeksArray(weeksArray, semester);
  }
}

export function getWeeksArrayByLessons(lessons) {
  let weeksArray = [];
  for (let lesson of lessons) {
    weeksArray.push(lesson.week);
  }
  return weeksArray.sort((a, b) => a - b);
}

export function getNumeratorByWeeksArray(weeks, semester) {
  const limit = semester === 'AUTUMN' ? autumnLimit : springLimit;
  let weeksToCompare = [];
  for (let i = limit === autumnLimit ? 1 : autumnLimit; i < limit; i += 2) {
    weeksToCompare.push(i);
  }
  if (arraysEqual(weeksToCompare, weeks)) {
    return 'NUMERATOR';
  }
  weeksToCompare = [];
  for (let i = limit === autumnLimit ? 2 : (autumnLimit + 1); i < limit; i += 2) {
    weeksToCompare.push(i);
  }
  if (arraysEqual(weeksToCompare, weeks)) {
    return 'DENOMINATOR';
  }
  weeksToCompare = [];
  for (let i = limit === autumnLimit ? 1 : autumnLimit; i < limit; i++) {
    weeksToCompare.push(i);
  }
  if (arraysEqual(weeksToCompare, weeks)) {
    return 'FULL';
  }
  return 'CUSTOM';
}

export function getWeekDayStringFromDate(date) {
  let dayWeek = [7, 1, 2, 3, 4, 5, 6][date.getDay()];
  switch (dayWeek) {
    case 1 :
      return 'MONDAY';
    case 2 :
      return 'TUESDAY';
    case 3 :
      return 'WEDNESDAY';
    case 4 :
      return 'THURSDAY';
    case 5 :
      return 'FRIDAY';
    case 6 :
      return 'SATURDAY';
    default :
      return 'SUNDAY';
  }
}

export function getShortDayWeekString(string) {
  switch (string) {
    case 'MONDAY' :
      return '????';
    case 'TUESDAY' :
      return '????';
    case 'WEDNESDAY' :
      return '????';
    case 'THURSDAY' :
      return '????';
    case 'FRIDAY' :
      return '????';
    case 'SATURDAY' :
      return '????';
    default :
      return '????';
  }
}

export function getFullDayWeekString(string) {
  switch (string) {
    case 'MONDAY' :
      return '??????????????????????';
    case 'TUESDAY' :
      return '??????????????';
    case 'WEDNESDAY' :
      return '??????????';
    case 'THURSDAY' :
      return '??????????????';
    case 'FRIDAY' :
      return '??????????????';
    case 'SATURDAY' :
      return '??????????????';
    default :
      return '??????????????????????';
  }
}

export function getMonthStringByDate(date) {
  if (date) {
    let monthValue = date.getMonth();
    switch (monthValue) {
      case 0:
        return '????????????'
      case 1:
        return '??????????????'
      case 2:
        return '??????????'
      case 3:
        return '????????????'
      case 4:
        return '??????'
      case 5:
        return '????????'
      case 6:
        return '????????'
      case 7:
        return '??????????????'
      case 8:
        return '????????????????'
      case 9:
        return '??????????????'
      case 10:
        return '????????????'
      case 11:
        return '??????????????'
    }
  } else {
    return '';
  }
}

export function getTypeNameByValue(type) {
  if (type) {
    switch (type) {
      case 'LAB' :
        return '???????????????????????? ????????????';
      case 'LECTURE' :
        return '????????????';
      case 'PRACTICE' :
        return '????????????????';
      case 'PE' :
        return '???????????????????? ????????????????';
      case 'LANGUAGE' :
        return '?????????????????????? ????????';
      case 'LECTURE_AND_LAB' :
        return '???????????? ?? ???????????????????????? ????????????';
      case 'PRACTICE_AND_LECTURE' :
        return '???????????????? ?? ????????????';
      case 'PRACTICE_AND_LAB' :
        return '???????????????????????? ???????????? ?? ????????????????';
      case 'MILITARY_TRAINING' :
        return '?????????????? ????????????????????';
      case 'RELOCATION' :
        return '??????????????';
      default:
        return '';
    }
  } else {
    return '';
  }
}

export function getTypeColorByValue(type) {
  if (type) {
    switch (type) {
      case 'LAB' :
        return 'background-color: rgba(175,220,236,0.9);';
      case 'LECTURE' :
        return 'background-color: rgba(213,218,175,0.9);';
      case 'PRACTICE' :
        return 'background-color: rgba(248,201,201,0.9);';
      case 'PE' :
        return 'background-color: rgba(41, 58, 128, 0.4)';
      case 'LANGUAGE' :
        return 'background-color: rgba(201,177,222,0.9);';
      case 'LECTURE_AND_LAB' :
        return 'background-color: rgba(195,236,198,0.9);';
      case 'PRACTICE_AND_LECTURE' :
        return 'background-color: rgba(253,237,185,0.9);';
      case 'PRACTICE_AND_LAB' :
        return 'background-color: rgba(191,253,222,0.9);';
      case 'MILITARY_TRAINING' :
        return 'background-color: rgba(203,182,155,0.9);';
      case 'RELOCATION' :
        return 'background-color: rgba(195,171,7,0.4);';
      default:
        return Dark.isActive ? 'background-color: gray' : 'background-color: gray';
    }
  } else {
    return Dark.isActive ? 'background-color: gray' : '';
  }
}
