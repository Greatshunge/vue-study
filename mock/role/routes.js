// Just a mock data

const constantRoutes = [
  {
    path: "/redirect",
    component: "layout/Layout",
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: "views/redirect/index",
      },
    ],
  },
  {
    path: "/login",
    component: "views/login/index",
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: "views/login/auth-redirect",
    hidden: true,
  },
  {
    path: "/404",
    component: "views/error-page/404",
    hidden: true,
  },
  {
    path: "/401",
    component: "views/error-page/401",
    hidden: true,
  },
  {
    path: "",
    component: "layout/Layout",
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        component: "views/dashboard/index",
        name: "Dashboard",
        meta: { title: "Dashboard", icon: "dashboard", affix: true },
      },
    ],
  },
];

const asyncRoutes = [
  {
    path: "/icon",
    component: "layout/Layout",
    children: [
      {
        path: "index",
        component: "views/icons/index",
        name: "Icons",
        meta: { title: "Icons", icon: "icon", noCache: true },
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

module.exports = {
  constantRoutes,
  asyncRoutes,
};
