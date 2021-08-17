export function getTableRowsFromLessons(lessons, date) {
  const timeArray = [];
  const daysArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const numerator = getTypeOfWeek(date);
  const numOfWeek = getNumberOfWeek(date);

  let lessonsOfSelectedWeek = [];
  for (let lesson of lessons) {
    if (lesson.week === numOfWeek) {
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
      rowObject['days'][day] = {}
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
        rowObject['days'][day] = lesson;
      }
    }
  }
  return rowsArray;
}

export function getTableColumns(rawLessonStringMode) {
  return [
    {
      name: 'time',
      label: 'Время',
      align: 'center',
      field: 'time',
      style: 'width: 100px',
      headerStyle: 'max-width: 100px',
    },
    {
      name: 'monday',
      label: 'Понедельник',
      align: 'center',
      style: (row) => getColorOfCellFromType(row.days.monday),
      headerStyle: 'max-width: 250px',
      field: (row) => getFieldName(row, 'monday', rawLessonStringMode),
    },
    {
      name: 'tuesday',
      label: 'Вторник',
      align: 'center',
      style: (row) => getColorOfCellFromType(row.days.tuesday),
      headerStyle: 'max-width: 250px',
      field: (row) =>  getFieldName(row, 'tuesday', rawLessonStringMode),
    },
    {
      name: 'wednesday',
      label: 'Среда',
      align: 'center',
      style: (row) => getColorOfCellFromType(row.days.wednesday),
      headerStyle: 'max-width: 250px',
      field: (row) =>  getFieldName(row, 'wednesday', rawLessonStringMode),
    },
    {
      name: 'thursday',
      label: 'Четверг',
      align: 'center',
      style: (row) => getColorOfCellFromType(row.days.thursday),
      headerStyle: 'max-width: 250px',
      field: (row) =>  getFieldName(row, 'thursday', rawLessonStringMode),
    },
    {
      name: 'friday',
      label: 'Пятница',
      align: 'center',
      style:  (row) => getColorOfCellFromType(row.days.friday),
      headerStyle: 'max-width: 250px',
      field: (row) =>  getFieldName(row, 'friday', rawLessonStringMode)
    },
    {
      name: 'saturday',
      label: 'Суббота',
      align: 'center',
      style: (row) => getColorOfCellFromType(row.days.saturday),
      headerStyle: 'max-width: 250px',
      field: (row) =>  getFieldName(row, 'saturday', rawLessonStringMode),
    },
  ];
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

export function getTypeOfWeek(date) {
  if (getNumberOfWeek(date) %2 === 0) {
    return 'DENOMINATOR';
  } else {
    return 'NUMERATOR';
  }
}

export function getNumberOfWeek(date) {

  //IDFK WTF WITH THIS SHIT P.s: calculate first week
  let tempDate = new Date(date);
  const tempSeptemberDate = new Date(tempDate.getFullYear(),8,1)
  if (tempDate < tempSeptemberDate) {
    for (let i = 0; i < 7; i++) {
      tempDate.setDate(tempDate.getDate() + 1);
      console.log(tempDate)
      console.log(tempSeptemberDate)
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

function getColorOfCellFromType(dayObject) {
  if (dayObject.typeEntity) {
    const typeName = dayObject.typeEntity.typeName;
    let style = 'width: 250px;'
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
    return style;
  }
}

function getFieldName(row, dayName, rawLessonStringMode) {
  if (rawLessonStringMode) {
    return row.days[dayName].rawLessonString;
  } else {
    return row.days[dayName].name;
  }
}
