import { boot } from 'quasar/wrappers'
import setupInterceptors from "src/services/other/setupInterceptors";
import EventBus from "src/common/eventBus";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { store, router } ) => {
  // something to do
  setupInterceptors(store);
  EventBus.on("logout", () => {
    store.dispatch("auth/logoutAction");
    //Probably we don't need it
    router.push("/");
  });
})
