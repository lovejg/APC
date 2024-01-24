import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/order/main",
      name: "ProductOrderPage",
      component: () => import("@/components/Order/OrderPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/order/view",
      name: "OrderReceiptPage",
      component: () => import("@/components/Order/OrderViewPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/order/:product_number",
      name: "OrderDetailPage",
      component: () => import("@/components/Order/OrderDetailPage"),
      meta: { requiresAuth: true },
    },
    {
      path: "/order/track/info",
      name: "TrackInfoPage",
      component: () => import("@/components/Track/TrackInfoPage"),
    }
  ],
});

import store from "./store/index";
function redirectToLogin(currentUrl,wantUrl) {
  const url = currentUrl.split('/');
  const changeurl = url[0] + '//' + url[2] +'/'+ wantUrl;
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
      redirectToLogin(window.location.href,'users/login');
    } else {
      next();
    }
  }
  if (to.meta.requiresAdmin) {
    const role = await store.getters.getUserRole;
    const access_message = await store.getters.getAccessMode;
    console.log(role);
    if (role == 0) {
      next();
    } else if(access_message==0){
      alert("로그인 후 이용해주세요.");
      redirectToLogin(window.location.href,'users/login');
    }else {
      alert("관리자 계정만 접근 가능합니다.");
      redirectToLogin(window.location.href,'users/login');
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
      redirectToLogin(window.location.href,'users/login');
    }
  } else {
    next();
  }
});

export default router;
