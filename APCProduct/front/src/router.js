import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/product/import",
      name: "ImportPage",
      component: () => import("@/components/Import/ImportPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/product/import/view",
      name: "ImportViewPage",
      component: () => import("@/components/Import/ImportViewPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/product/import/input",
      name: "ImportInputPage",
      component: () => import("@/components/Import/ImportInputPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/product/counsel",
      name: "CustomerServicePage",
      component: () =>
        import("@/components/CustomerService/CustomerServicePage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/product/counsel/view", //view : admin console 이나 userpage로 이동하기위해 만듬
      meta: { requiresCounselRole: true },
    },
    {
      path: "/product/counsel/admin/view",
      name: "CheckCSAdminPage",
      component: () => import("@/components/CustomerService/CheckCSAdminPage"),
      meta: { requiresAdmin: true },
    },
    {
      path: "/product/counsel/user/view",
      name: "CheckCSUserPage",
      component: () => import("@/components/CustomerService/CheckCSUserPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/product/statistics/sales",
      name: "SalesPage",
      component: () => import("@/components/Statistics/SalesPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/product/statistics/review",
      name: "StarReview",
      component: () => import("@/components/Statistics/StarReview"),
      meta: { requiresAuth: true },
    },
  ],
});

import store from "./store/index";
function redirectToLogin(currentUrl, wantUrl) {
  const url = currentUrl.split('/');
  const changeurl = url[0] + '//' + url[2] + '/' + wantUrl;
  window.location.href = changeurl;
}
router.beforeEach(async function (to, _, next) {
  await store.dispatch("refresh");
  await store.dispatch("getAlert");
  if (to.meta.requiresAuth) {
    await store.dispatch("verify");
    const access_message = await store.getters.getAccessMode;
    console.log(access_message);
    if (access_message == 0) {
      alert("로그인 후 이용해주세요.");
      redirectToLogin(window.location.href, 'users/login');

    } else {
      next();
    }
  }
  if (to.meta.requiresAdmin) {
    const role = await store.getters.getUserRole;
    console.log(role);
    const access_message = await store.getters.getAccessMode;
    if (role == 0) {
      next();
    } else if (access_message == 0) {
      alert("로그인 후 이용해주세요.");
      redirectToLogin(window.location.href, 'users/login');
    } else {
      alert("관리자 계정만 접근 가능합니다.");
      redirectToLogin(window.location.href, 'users/login');

    }
  }
  if (to.meta.requiresRole) {
    const role = await store.getters.getUserRole;
    console.log(role);
    if (role == 0) {
      next("/users/adminpage");
    } else if (role == 1) {
      next("/users/usermypage");
    } else {
      alert("로그인 후 이용해주세요.");
      redirectToLogin(window.location.href, 'users/login');

    }
  }
  if (to.meta.requiresCounselRole) {
    const role = await store.getters.getUserRole;
    console.log(role);
    if (role == 0) {
      next("/product/counsel/admin/view");
    } else if (role == 1) {
      next("/product/counsel/user/view");
    } else {
      alert("로그인 후 이용해주세요.");
      redirectToLogin(window.location.href, 'users/login');

    }
  } else {
    next();
  }
});

export default router;
