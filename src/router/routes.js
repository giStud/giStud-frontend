import {Platform} from "quasar";

const mobile = [
  {
    path: '/',
    component: () => import('layouts/MobileMainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/mobile/mHome.vue'), meta: {isAuth: false, isAdmin: false}
      }, {
        path: '/schedule',
        name: 'schedule',
        component: () => import('pages/mobile/mSchedule'),
        props: (route) => ({univName: route.query.univName}),
        meta: {isAuth: false, isAdmin: false}
      }, {
        path: '/profile',
        name: 'profile',
        component: () => import('pages/mobile/mProfile'),
        props: (route) => ({univName: route.query.univName}),
        meta: {isAuth: false, isAdmin: false}
      }, {
        path: '/news',
        name: 'news',
        component: () => import('pages/mobile/mNews'),
        props: (route) => ({univName: route.query.univName}),
        meta: {isAuth: false, isAdmin: false}
      },
    ]
  }
]


const desktop = [
  // NEW REDESIGN ^^^
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/desktop/dHome'), meta: {isAuth: false, isAdmin: false}},
      {
        path: '/schedule',
        name: 'schedule',
        component: () => import('pages/desktop/dSchedule'),
        props: (route) => ({univName: route.query.univName}),
        meta: {isAuth: false, isAdmin: false}
      },
      {
        path: '/news',
        name: 'news',
        component: () => import('pages/News.vue'),
        props: (route) => ({newsId: route.query.newsId}),
        meta: {isAuth: false, isAdmin: false}
      }
    ]
  },
  {
    path: "/auth",
    //component: () => import('layouts/AuthLayout.vue'),
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: 'login', component: () => import('components/Login'), meta: {isAuth: false, isAdmin: false}},
      {path: 'signup', component: () => import('components/Registration'), meta: {isAuth: false, isAdmin: false}}
    ]
  },
  {
    path: "/admin",
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Admin.vue'), meta: {isAuth: true, isAdmin: true}} //todo  ВСЕ НА ТРУ
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
];

let routes = [];

if (Platform.is.desktop) {
  routes = desktop;
}
if (Platform.is.mobile) {
  routes = mobile;
}


export default routes
