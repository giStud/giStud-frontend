import Profile from "components/Profile"


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Index.vue'), meta: {isAuth: false, isAdmin: false}},
      {path: '/schedule', component: () => import('pages/Schedule'), meta: {isAuth: false, isAdmin: false}},
      {path: '/schedulesLoading', component: () => import('pages/ScheduleLoading.vue'), meta: {isAuth: true, isAdmin: true}}
    ]
  },
  {
    path: "/auth",
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {path: 'login', component: () => import('components/Login'), meta: {isAuth: false, isAdmin: false}},
      {path: 'signup', component: () => import('components/Registration'), meta: {isAuth: false, isAdmin: false}}
    ]
  },
  // {
  //   path: "/profile",
  //   // lazy-loaded
  //   component: Profile,
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
    meta: {isAuth: false, isAdmin: false}
  }
]

export default routes
