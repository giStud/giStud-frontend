import UtilsService from '../../services/other/utilsService'

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
    let time = lesson.time.substr(0,5);
    time = time.substr(0,1) === '0' ? time.substr(1) : time;
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
        } else if(dayArray.length === 0) {
          dayArray.push(lesson);
        }
      }
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
    let time = lesson.time.substr(0,5);
    time = time.substr(0,1) === '0' ? time.substr(1) : time;
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
        } else if(lessonsFromRow.length === 0) {
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
  if (getNumberOfWeek(date) %2 === 0) {
    return 'DENOMINATOR';
  } else {
    return 'NUMERATOR';
  }
}

export function getTypeOfWeek(week) {
  if (week %2 === 0) {
    return 'DENOMINATOR';
  } else {
    return 'NUMERATOR';
  }
}

export function getStartDateOfWeek(week, year) {
  let weekCounter = 1;
  let startDate = new Date(year, 8, 1);

  while (weekCounter < week)
  {
    if (startDate.getDay() === 0)
    {
      weekCounter++;
    }
    startDate.setDate(startDate.getDate() + 1);
  }

  return getDateOfMonday(startDate);
}

export function getNumberOfWeek(date) {

  //IDFK WTF WITH THIS SHIT P.s: calculate first week
  let tempDate = new Date(date);
  const tempSeptemberDate = new Date(tempDate.getFullYear(),8,1)
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
  if (date.getMonth() >= 8)
  {
    year = date.getFullYear();
  } else {
    year = date.getFullYear() - 1;
  }

  //1 september
  let startDate = new Date(year, 8, 1);

  while (startDate < date)
  {
    if (startDate.getDay() === 0)
    {
      weekCounter++;
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  return weekCounter;
}

export function getScheduleCellColor(dayObject, splitterMode) {
  if (dayObject.typeEntity) {
    const typeName = dayObject.typeEntity.typeName;
    let style = 'border-color: #959595; ';//width: 250px; text-align: center;
    if (splitterMode) {
      style += 'padding: 0px; '
    } else {
      switch (typeName) {
        case 'LAB' : {
          style += 'background-color: rgba(204,220,236,0.9);';
          break;
        }
        case 'LECTURE' : {
          style += 'background-color: rgba(213,218,175,0.9);';
          break;
        }
        case 'PRACTICE' : {
          style += 'background-color: rgba(248,201,201,0.9);';
          break;
        }
        case 'PE' : {
          style += 'background-color: rgba(41, 58, 128, 0.4)';
          break
        }
        case 'LANGUAGE' : {
          style += 'background-color: rgba(201,177,222,0.9);';
          break;
        }
        case 'LECTURE_AND_LAB' : {
          style += 'background-color: rgba(195,236,198,0.9);';
          break;
        }
        case 'PRACTICE_AND_LECTURE' : {
          style += 'background-color: rgba(253,237,185,0.9);';
          break;
        }
        case 'PRACTICE_AND_LAB' : {
          style+= 'background-color: rgba(191,253,222,0.9);'
          break;
        }
        case 'MILITARY_TRAINING' : {
          style+= 'background-color: rgba(203,182,155,0.9);'
          break;
        }
        case 'RELOCATION' : {
          style+= 'background-color: rgba(195,171,7,0.4);'
          break;
        }
      }
    }
    return style;
  }
}
