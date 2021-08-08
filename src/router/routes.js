import Home from "components/Home.vue";
import Login from "components/Login.vue";
import Register from "components/Register.vue";
import BoardAdmin from "components/BoardAdmin";
import BoardModerator from "components/BoardModer";
import BoardUser from "components/BoardUser";
import Profile from "components/Profile"


const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') }
  //   ]
  // },

  {
    path: '/groupSelecting',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Schedule') }
    ]
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: "/admin",
    // lazy-loaded
    component: BoardAdmin,
  },
  {
    path: "/mod",
    // lazy-loaded
    component: BoardModerator,
  },
  {
    path: "/user",
    // lazy-loaded
    component: BoardUser,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
