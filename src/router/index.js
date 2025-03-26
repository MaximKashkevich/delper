import { createRouter, createWebHistory } from 'vue-router'; // Import Vue Router for Vue 3
import LoginPage from "@/views/LoginPage";
import RegisterPage from "@/views/RegisterPage";
import DashboardPage from "@/views/DashboardPage.vue";
import PasswordRecoveryPage from "@/views/PasswordRecoveryPage.vue";
import ForgotPasswordPage from "@/views/ForgotPasswordPage.vue";
import store from '../store/index';

const ifAuthenticated = (to, from, next) => {
    if (store.getters['ui/isAuthenticated']) {
        next();
    } else {
        next('/login');
    }
};

const routes = [
    {
        path: '/',
        name: 'main',
        component: DashboardPage,
        beforeEnter: ifAuthenticated,
    },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    { path: "/password-recovery", component: PasswordRecoveryPage },
    { path: "/forgot-password", component: ForgotPasswordPage },
    { path: "/dashboard", name: 'dashboard', component: DashboardPage, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated']; // Проверка через Vuex
    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;
