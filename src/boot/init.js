import { boot } from 'quasar/wrappers'
import setupInterceptors from "src/services/setupInterceptors";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { store } ) => {
  // something to do
  setupInterceptors(store);
})
