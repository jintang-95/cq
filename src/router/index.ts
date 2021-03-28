import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import ManagerIndex from "@/views/manager/index.vue";
import { getUserInfo } from "@/util";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/manager",
    name: "Manager",
    component: ManagerIndex,
    children: [
      {
        path: "system",
        name: "System",
        component: () =>
          import(
            /* webpackChunkName: "manager-system" */ "../views/manager/system/index.vue"
          ),
      },
      {
        path: "user",
        name: "User",
        component: () =>
          import(
            /* webpackChunkName: "manager-user" */ "../views/manager/user/index.vue"
          ),
      },
      {
        path: "role",
        name: "Role",
        component: () =>
          import(
            /* webpackChunkName: "manager-role" */ "../views/manager/role/index.vue"
          ),
      },
      {
        path: "field",
        name: "Field",
        component: () =>
          import(
            /* webpackChunkName: "manager-role" */ "../views/manager/field/index.vue"
          ),
      },
      {
        path: "monitor",
        name: "Monitor",
        component: () =>
          import(
            /* webpackChunkName: "manager-role" */ "../views/manager/monitor/index.vue"
          ),
      },
      {
        path: "logs",
        name: "Logs",
        component: () =>
          import(
            /* webpackChunkName: "manager-role" */ "../views/manager/logs/index.vue"
          ),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      hideHeader: true,
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: () =>
      import(/* webpackChunkName: "favorites" */ "../views/Favorites.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const { userName, isAdmin } = getUserInfo();

  if (userName) {
    if (to.path === "/login") {
      next("/");
    } else {
      // 不是 admin 且访问 manager 重定向到首页
      if (!isAdmin && to.path.indexOf("/manager") === 0) {
        next("/");
      } else {
        next();
      }
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});
export default router;
