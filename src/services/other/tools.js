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

export function getEditorFonts() {
  return  {
    arial: 'Arial',
    arial_black: 'Arial Black',
    comic_sans: 'Comic Sans MS',
    courier_new: 'Courier New',
    impact: 'Impact',
    lucida_grande: 'Lucida Grande',
    times_new_roman: 'Times New Roman',
    verdana: 'Verdana'
  }
}

export function getEditorToolBar(q) {
  return [
    [
      {
        label: q.lang.editor.align,
        icon: q.iconSet.editor.align,
        fixedLabel: true,
        list: 'only-icons',
        options: ['left', 'center', 'right', 'justify']
      },
      {
        label: q.lang.editor.align,
        icon: q.iconSet.editor.align,
        fixedLabel: true,
        options: ['left', 'center', 'right', 'justify']
      }
    ],
    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
    ['token', 'hr', 'link', 'custom_btn'],
    ['print', 'fullscreen'],
    [
      {
        label: q.lang.editor.formatting,
        icon: q.iconSet.editor.formatting,
        list: 'no-icons',
        options: [
          'p',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'code'
        ]
      },
      {
        label: q.lang.editor.fontSize,
        icon: q.iconSet.editor.fontSize,
        fixedLabel: true,
        fixedIcon: true,
        list: 'no-icons',
        options: [
          'size-1',
          'size-2',
          'size-3',
          'size-4',
          'size-5',
          'size-6',
          'size-7'
        ]
      },
      {
        label: q.lang.editor.defaultFont,
        icon: q.iconSet.editor.font,
        fixedIcon: true,
        list: 'no-icons',
        options: [
          'default_font',
          'arial',
          'arial_black',
          'comic_sans',
          'courier_new',
          'impact',
          'lucida_grande',
          'times_new_roman',
          'verdana'
        ]
      },
      'removeFormat'
    ],
    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

    ['undo', 'redo'],
    ['viewsource']
  ]

}
