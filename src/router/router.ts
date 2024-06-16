import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage/LoginPage.vue'),
  },
  {
    path: '/',
    name: 'home',
    meta: {
      requiredAuth: true,
    },
    component: () => import('../pages/HomePage/HomePage.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    window.scrollTo(0, 0);
  },
});

router.beforeEach(async (to, _from, next) => {
  const jwt = localStorage.getItem('jwt');

  if (!jwt && to.meta.requiredAuth) {
    next('/login');
  } else if (jwt && to.path === '/login') {
    next('/');
  } else {
    next();
  }
});

export default router;
