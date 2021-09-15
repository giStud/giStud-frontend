import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import schedule from './schedule'
import auth from './auth'
import news from './news'
import globalState from './globalState'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
      schedule,
      news,
      globalState
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
