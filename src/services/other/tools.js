import {Platform} from "quasar";

export function customStyle(desktop, mobile) {
  let styleValid = ''
  if (Platform.is.desktop) {
    styleValid += desktop;
  }
  if (Platform.is.mobile) {
    styleValid += mobile;
  }
  return styleValid;
}

export function customClass(desktop, mobile) {
  let styleValid = ''
  if (Platform.is.desktop) {
    styleValid += desktop;
  }
  if (Platform.is.mobile) {
    styleValid += mobile;
  }
  return styleValid;
}
