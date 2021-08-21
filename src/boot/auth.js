import { boot } from 'quasar/wrappers'
import store from "vuex";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({store, router} ) => {
  router.beforeEach((to, from, next) => {

    const auth = to.meta.isAuth;
    const admin = to.meta.isAdmin;

    const loggedIn = store.getters['auth/isLogged'];
    const user = store.getters['auth/getCurrentUser'];

    if (!auth) {
      next();
    }

    if (auth && !loggedIn && !admin) {
      next('/auth/login');
    }

    if (auth && loggedIn && admin) {
      const userRoles = user.roles;
      if (userRoles.includes('ROLE_ADMIN')) {
        next();
      } else {
        next('/forbidden');
      }
    }
  });
})
