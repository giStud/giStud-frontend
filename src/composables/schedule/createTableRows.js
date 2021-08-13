export default function createTableRowsFromLessons(lessons) {
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
