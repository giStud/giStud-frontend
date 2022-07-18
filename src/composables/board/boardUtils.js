export function getImageUrlByByteArray(byteArray) {
  if (byteArray != null) {
    return 'data:image/png;base64,' + btoa(
      new Uint8Array(byteArray)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  } else {
    return null;
  }
}

export async function getFileAndDataUrlByByteArray(byteArray, fileName) {
  const dataUrl = getImageUrlByByteArray(byteArray);
  const blob = await fetch(dataUrl).then(it => {
    return it.blob()
  })
  const file = new File([blob], fileName);
  return {
    dataUrl,
    file
  }
}
