import store from '../../store'
import UtilsService from "../../services/utilsService"

export function getTableRowsFromLessons(lessons) {
  const timeArray = ['8:00', '9:45', '11:30', '13:30', '15:15', '17:00'];
  const daysArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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

    for (let rowObject of rowsArray) {
      if (rowObject.time === time) {
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
      label: 'Понедельник\n' + getDateString(getDateOfMonday()),
      align: 'center',
      field: (row) => row.days.monday.name,
      classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
    },
    {
      name: 'tuesday',
      label: 'Вторник\n' + getDateString(UtilsService.incrementDateDays(getDateOfMonday(),1)),
      align: 'center',
      field: (row) => row.days.tuesday.name,
      classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-blue' : 'bg-red'
    },
    {
      name: 'wednesday',
      label: 'Среда\n' + getDateString(UtilsService.incrementDateDays(getDateOfMonday(),2)),
      align: 'center',
      field: (row) => row.days.wednesday.name,
      classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
    },
    {
      name: 'thursday',
      label: 'Четверг\n' + getDateString(UtilsService.incrementDateDays(getDateOfMonday(),3)),
      align: 'center',
      field: (row) => row.days.thursday.name,
      classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
    },
    {
      name: 'friday',
      label: 'Пятница\n' + getDateString(UtilsService.incrementDateDays(getDateOfMonday(),4)),
      align: 'center',
      field: (row) => row.days.friday.name,
      classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
    },
    {
      name: 'saturday',
      label: 'Суббота\n' + getDateString(UtilsService.incrementDateDays(getDateOfMonday(),5)),
      align: 'center',
      field: (row) => row.days.saturday.name,
      classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
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

function getDateOfMonday() {
  let date = store().getters['schedule/getCurrentDate']
  let dayWeek = [7, 1, 2, 3, 4, 5, 6][date.getDay()];
  date.setDate(date.getDate() - (dayWeek - 1));

  return date;
}
