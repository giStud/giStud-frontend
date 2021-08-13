class UtilsService {
  incrementDateDays(date, incrementValue) {
    date.setDate(date.getDate() + incrementValue)
    return date;
  }
}

export default new UtilsService();
