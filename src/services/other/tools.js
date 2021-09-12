import {Platform, Dark} from "quasar";

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

export function theme(light, darkT) {
  return Dark.isActive ? darkT : light;
}

export function goUrl(url) {
  window.open(url);
}

export function debug(val) {
  console.log(val)
}
