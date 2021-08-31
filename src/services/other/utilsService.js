class UtilsService {
  isValidEmail(val) {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || "Недопустимый email";
  }

  getTimeString(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' +
      (minutes < 10 ? '0' + minutes : minutes);
  }
}

export default new UtilsService();
