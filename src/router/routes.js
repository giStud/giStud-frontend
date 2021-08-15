import Profile from "components/Profile"


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Index.vue')}
    ]
  },

  {
    path: '/schedule',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Schedule')}
    ]
  },
  {
    path: "/auth",
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {path: 'login', component: () => import('components/Login')},
      {path: 'signup', component: () => import('components/Registration')}
    ]
  },
  {
    path: "/schedulesLoading",
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/ScheduleLoading.vue')}
    ]
  },
  {
    path: "/profile",
    // lazy-loaded
    component: Profile,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
