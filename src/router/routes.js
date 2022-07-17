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
      {
        path: '',
        component: () => import('pages/desktop/dHome'),
        meta: {isAuth: false, isAdmin: false}
      }, {
        path: '/schedule',
        name: 'schedule',
        component: () => import('pages/desktop/dSchedule'),
        props: (route) => ({univId: route.query.univId, grId: route.query.grId}),
        meta: {isAuth: false, isAdmin: false}
      }, {
        path: '/news',
        name: 'news',
        component: () => import('pages/desktop/dNews.vue'),
        props: (route) => ({newsId: route.query.newsId}),
        meta: {isAuth: false, isAdmin: false}
      },
      {
        path: "/board",
        children: [
          {path: 'list', component: () => import('pages/desktop/dBoardList.vue'), meta: {isAuth: false, isAdmin: false}},
          {path: 'create', component: () => import('pages/desktop/dCardView'), meta: {isAuth: true, isAdmin: false}}
        ]
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('pages/desktop/dAbout.vue'),
        meta: {isAuth: false, isAdmin: false}
      }
      , {
        path: '/test',
        name: 'test',
        component: () => import('pages/Test.vue'),
        meta: {isAuth: true, isAdmin: true}
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
