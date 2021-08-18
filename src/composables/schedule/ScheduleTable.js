export function getTableRowsFromLessons(lessons, week) {
  const timeArray = [];
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
  }
  timeArray.sort();
  for (let time in timeArray) {
    let timeValue = timeArray[time];
    timeValue = timeValue.substr(0,5);
    timeValue = timeValue.substr(0,1) === '0' ? timeValue.substr(1) : timeValue;
    timeArray[time] = timeValue;
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
      if (rowObject.time === time && (lessonNumerator === numerator || lessonNumerator === 'FULL')) {
        let dayArray = rowObject['days'][day];
        if (lesson.name !== '') {
          if (dayArray.length !== 0) {
            if (dayArray[0].name === '') {
              dayArray[0] = lesson;
            } else {
              dayArray.push(lesson);
            }
          } else {
            if (lesson.name === 'testLesson') {
              let obj = {
                "lessonId": 9999,
                "rawLessonString": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium amet delectus",
                "name": "testLesson",
                "numerator": "FULL",
                "time": "17:00:00",
                "day": "FRIDAY",
                "week": 4,
                "typeEntity":
                  {
                    "typeId": 88,
                    "typeName": "MILITARY_TRAINING"
                  },
                "audienceEntity":
                  {
                    "audienceId": 470,
                    "x": null,
                    "y": null,
                    "z": null,
                    "building": null,
                    "audience": "UNKNOWN"
                  }
              }
              dayArray.push(obj);
            } else {
              dayArray.push(lesson);
            }

          }
        } else if(dayArray.length === 0) {
          dayArray.push(lesson);
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

export function getScheduleCellStyle(dayObject, splitterMode) {
  if (dayObject.typeEntity) {
    const typeName = dayObject.typeEntity.typeName;
    let style = 'width: 250px; text-align: center;'
    if (splitterMode) {
      style += 'padding: 0px;'
    } else {
      switch (typeName) {
        case 'LAB' : {
          style += 'background-color: rgba(169, 191, 90, 0.5);';
          break;
        }
        case 'LANGUAGE' : {
          style += 'background-color: rgba(242, 172, 41, 0.5);';
          break;
        }
        case 'LECTURE' : {
          style += 'background-color: rgba(38, 180, 201, 0.5);';
          break;
        }
        case 'LECTURE_AND_LAB' : {
          style += 'background-color: rgba(128, 111, 111, 0.5);';
          break;
        }
        case 'MILITARY_TRAINING' : {
          style+= 'background-color: rgba(238, 111, 111, 0.5);'
          break;
        }
        case 'PE' : {
          style += 'background-color: rgba(238, 111, 111, 0.5);';
          break
        }
        case 'PRACTICE' : {
          style += 'background-color: rgba(238, 111, 111, 0.5);';
          break;
        }
        case 'PRACTICE_AND_LECTURE' : {
          style += 'background-color: rgba(238, 111, 111, 0.5);';
          break;
        }
        case 'RELOCATION' : {
          style += 'background-color: rgba(238, 111, 111, 0.5);';
          break;
        }
      }
    }
    return style;
  }
}
