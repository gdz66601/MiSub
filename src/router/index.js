import { createRouter, createWebHistory } from 'vue-router';

// Lazy load views for better performance
const DashboardView = () => import('../views/DashboardView.vue');
const SubscriptionGroupsView = () => import('../views/SubscriptionGroupsView.vue');
const ManualNodesView = () => import('../views/ManualNodesView.vue');
const MySubscriptionsView = () => import('../views/MySubscriptionsView.vue');
const SettingsView = () => import('../views/SettingsView.vue');

const HomeView = () => import('../views/HomeView.vue'); // [NEW] Wrapper View

const routes = [
    {
        path: '/',  // Root path is HomeView (Smart Wrapper)
        name: 'Home',
        component: HomeView,
        alias: '/explore',
        meta: { title: '首页', isPublic: true } // Publicly accessible, view handles content
    },
    {
        path: '/dashboard', // Explicit dashboard route redirects to home or is alias
        redirect: '/'
    },
    {
        path: '/groups',
        name: 'SubscriptionGroups',
        component: SubscriptionGroupsView,
        meta: { title: '订阅组' }
    },
    {
        path: '/nodes',
        name: 'ManualNodes',
        component: ManualNodesView,
        meta: { title: '手工节点' }
    },
    {
        path: '/subscriptions',
        name: 'MySubscriptions',
        component: MySubscriptionsView,
        meta: { title: '我的订阅' }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: SettingsView,
        meta: { title: '设置' }
    },
    /* 
    // [REMOVED] Static /login route. 
    // Handled dynamically by Catch-All route (Entrance.vue) to support Custom Login Path.
    {
        path: '/login',
        name: 'Login',
        component: () => import('../components/modals/Login.vue'),
        meta: { title: '登录', isPublic: false } 
    }, 
    */
    {
        // Catch-all route for Custom Login Path or 404
        path: '/:pathMatch(.*)*',
        name: 'Entrance',
        component: () => import('../views/Entrance.vue'),
        meta: { title: 'MiSub', isPublic: true } // Public, so Entrance.vue can decide what to render
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
    // Update title - 只在已登录状态下设置应用标题，避免在伪装模式暴露特征
    if (typeof document !== 'undefined') {
        // 通过检查 pinia store 中的 session 状态来判断是否已登录
        // 由于 router guard 可能在 pinia 初始化之前运行，使用 try-catch 保护
        try {
            const { useSessionStore } = await import('../stores/session');
            const sessionStore = useSessionStore();
            if (sessionStore.sessionState === 'loggedIn') {
                document.title = to.meta.title ? `${to.meta.title} - MISUB` : 'MISUB';
            }
            // 未登录时保持当前 title 不变（伪装模式下为 "404 Not Found"）
        } catch {
            // pinia 尚未初始化，不设置 title
        }
    }

    next();
});

export default router;
