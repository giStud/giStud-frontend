import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({store, router} ) => {
  router.beforeEach(async (to, from, next) => {

    const auth = to.meta.isAuth;
    const admin = to.meta.isAdmin;

    const loggedIn = store.getters['auth/isLogged'];
    let user = store.getters['auth/getCurrentUser'];
    if (user !== null && !user.roles) {
      await store.dispatch('auth/getUserRolesAction', {userId : user.id});
      user = store.getters['auth/getCurrentUser'];
    }

    if (!auth) {
      next();
    }

    if (auth && !loggedIn && !admin) {
      next('/auth/login');
    }

    if (auth && loggedIn && admin && user !== null) {
      const userRoles = user.roles;
      if (userRoles.includes('ROLE_ADMIN')) {
        next();
      } else {
        next('/forbidden');
      }
    }
  });
})
