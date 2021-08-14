import store from '../../store'

export function getTableRowsFromLessons(lessons, date) {
  const timeArray = ['8:00', '9:45', '11:30', '13:30', '15:15', '17:00'];
  const daysArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const numerator = getTypeOfWeek(date)
  let rowsArray = []

  for (let indexOfTimeArray = 0; indexOfTimeArray < 6; indexOfTimeArray++) {
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

  for (let lesson of lessons) {
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

export function getTableColumns() {
  return [
    {
      name: 'time',
      label: 'Время',
      align: 'center',
      field: 'time',
    },
    {
      name: 'monday',
      label: 'Понедельник',
      align: 'center',
      field: (row) => row.days.monday.name,
      classes: (row) => getColorOfCellFromType(row.days.monday)
    },
    {
      name: 'tuesday',
      label: 'Вторник',
      align: 'center',
      field: (row) => row.days.tuesday.name,
      classes: (row) => getColorOfCellFromType(row.days.tuesday)
    },
    {
      name: 'wednesday',
      label: 'Среда',
      align: 'center',
      field: (row) => row.days.wednesday.name,
      classes: (row) => getColorOfCellFromType(row.days.wednesday)
    },
    {
      name: 'thursday',
      label: 'Четверг',
      align: 'center',
      field: (row) => row.days.thursday.name,
      classes: (row) => getColorOfCellFromType(row.days.thursday)
    },
    {
      name: 'friday',
      label: 'Пятница',
      align: 'center',
      field: (row) => row.days.friday.name,
      classes: (row) => getColorOfCellFromType(row.days.friday)
    },
    {
      name: 'saturday',
      label: 'Суббота',
      align: 'center',
      field: (row) => row.days.saturday.name,
      classes: (row) => getColorOfCellFromType(row.days.saturday)
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
    switch (typeName) {
      case 'LAB' : return 'bg-green'
      case 'LANGUAGE' : return 'bg-yellow'
      case 'LECTURE' : return 'bg-red'
      case 'PRACTICE' : return 'bg-blue'
      case 'PE' : return 'bg-orange'
      case 'RELOCATION' : return 'bg-gray'
      case 'MILITARY_TRAINING' : return 'bg-black'
      default: {
        console.log(typeName)
        return 'bg-white'
      }
    }
  }
}
