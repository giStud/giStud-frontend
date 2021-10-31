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

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
