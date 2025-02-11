import NetCut from "@/components/netcut/NetCut.vue";
import useUserStore from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: NetCut,
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: () => import('@/components/Login/index.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/Signup/index.vue'),
      meta: {
        guestOnly: true
      }
    },
    {
      path: '/:pathMatch(.*)*',  // 匹配所有路径，如果路径不存在，则重定向到首页
      redirect: '/'
    }
  ],
});

router.beforeEach(async (to, _) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    if (!userStore.token) {
      return {
        path: '/login',
        query: { redirect: to.fullPath }
      };
    }
    return true;
  }

  if (to.meta.guestOnly && userStore.token) {
    return { path: '/' };
  }

  return true;
})

export default router;
