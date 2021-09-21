import UtilsService from '../../services/other/utilsService'
import {theme} from "src/services/other/tools";
import {Dark} from "quasar";

export function getTableRowsFromLessons(lessons, week) {
  let timeArray = [];
  const daysArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const numerator = getTypeOfWeek(week);
  let lessonsOfSelectedWeek = [];
  for (let lesson of lessons) {

    if (lesson.week === week) {
      lessonsOfSelectedWeek.push(lesson);
    }
  }

  for (let lesson of lessonsOfSelectedWeek) {
    timeArray.push(lesson.time);
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
  let rowsArray = []
  for (let indexOfTimeArray = 0; indexOfTimeArray < timeArray.length; indexOfTimeArray++) {
    let rowObject = {}
    rowObject['rowNum'] = indexOfTimeArray;
    rowObject['time'] = timeArray[indexOfTimeArray]
    rowObject['days'] = {}
    for (let indexOfDaysArray = 0; indexOfDaysArray < 6; indexOfDaysArray++) {
      let day = daysArray[indexOfDaysArray];
      rowObject['days'][day] = []
    }
    rowsArray[indexOfTimeArray] = rowObject
  }

  for (let lesson of lessonsOfSelectedWeek) {
    let time = lesson.time.substr(0, 5);
    const day = lesson.day.toLocaleLowerCase();
    const lessonNumerator = lesson.numerator;


    for (let rowObject of rowsArray) {
      if (rowObject.time.lessonBeginTime === time && (lessonNumerator === numerator || lessonNumerator === 'FULL')) {
        let dayArray = rowObject['days'][day];
        if (lesson.name !== '') {
          if (dayArray.length !== 0) {
            if (dayArray[0].name === '') {
              dayArray[0] = lesson;
            } else {
              dayArray.push(lesson);
            }
          } else {
            dayArray.push(lesson);
          }
        } else if (dayArray.length === 0) {
          dayArray.push(lesson);
        }
      }
    }
  }
  return rowsArray;
}

export function getLessonFromSelectedDate(lessons, date) {
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
      timeArray.push(lesson.time);
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
        lessonFinishTime,
      }
    }

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
  } else {
    const timeArray = [
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

    for (let indexOfTimeArray = 0; indexOfTimeArray < timeArray.length; indexOfTimeArray++) {
      let rowObject = {}
      rowObject['lessonNumber'] = indexOfTimeArray + 1;
      rowObject['time'] = timeArray[indexOfTimeArray]
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

export function getScheduleCellColor(dayObject, splitterMode) {
  if (dayObject && dayObject.typeEntity) {
    const typeName = dayObject.typeEntity.typeName;
    let style = 'border-color: #959595; ';//width: 250px; text-align: center;
    if (splitterMode) {
      style += 'padding: 0px; '
    } else {
      style += getTypeColorByValue(typeName);
    }
    return style;
  }
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
    startDate.setHours(beginLessonArray[0])
    startDate.setMinutes(beginLessonArray[1])
    startDate.setSeconds(0);
    let finishDate = new Date();
    finishDate.setHours(finishLessonArray[0])
    finishDate.setMinutes(finishLessonArray[1])
    startDate.setSeconds(0);

    return currentDate >= startDate && currentDate <= finishDate;
  } else {
    return false;
  }
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
      return 'Пн';
    case 'TUESDAY' :
      return 'Вт';
    case 'WEDNESDAY' :
      return 'Ср';
    case 'THURSDAY' :
      return 'Чт';
    case 'FRIDAY' :
      return 'Пт';
    case 'SATURDAY' :
      return 'Сб';
    default :
      return 'Вс';
  }
}

export function getMonthStringByDate(date) {
  if (date) {
    let monthValue = date.getMonth();
    switch (monthValue) {
      case 0:
        return 'января'
      case 1:
        return 'февраля'
      case 2:
        return 'марта'
      case 3:
        return 'апреля'
      case 4:
        return 'мая'
      case 5:
        return 'июня'
      case 6:
        return 'июля'
      case 7:
        return 'августа'
      case 8:
        return 'сентября'
      case 9:
        return 'октября'
      case 10:
        return 'ноября'
      case 11:
        return 'декабря'
    }
  } else {
    return '';
  }
}

export function getTypeNameByValue(type) {
  if (type) {
    switch (type) {
      case 'LAB' :
        return 'Лабораторная работа';
      case 'LECTURE' :
        return 'Лекция';
      case 'PRACTICE' :
        return 'Практика';
      case 'PE' :
        return 'Физическая культура';
      case 'LANGUAGE' :
        return 'Иностранный язык';
      case 'LECTURE_AND_LAB' :
        return 'Лекция и лабораторная работа';
      case 'PRACTICE_AND_LECTURE' :
        return 'Практика и лекция';
      case 'PRACTICE_AND_LAB' :
        return 'Лабораторная работа и практика';
      case 'MILITARY_TRAINING' :
        return 'Военная подготовка';
      case 'RELOCATION' :
        return 'Переезд';
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
        return Dark.isActive ? 'background-color: gray' : '';
    }
  } else {
    return Dark.isActive ? 'background-color: gray' : '';
  }
}
