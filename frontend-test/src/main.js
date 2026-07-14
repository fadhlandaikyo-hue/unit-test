import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from "vue-router"
import './style.css'

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }

        return { top: 0, left: 0 }
    },
    routes: [

        // Page for Users
        {
            path: "/register",
            component: () => import("./components/User/UserRegister.vue"),
        },
        {
            path: "/login",
            component: () => import("./components/User/UserLogin.vue"),
        },
        {
            path: "/register-copy",
            component: () => import("./components/User/UserRegisterCopy.vue"),
        },
        {
            path: "/dashboard",
            component: () => import("./components/User/Dashboard.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/profile",
            component: () => import("./components/User/UserProfile.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/construction",
            component: () => import("./components/ContentUser/UserConstructionList.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/file",
            component: () => import("./components/ContentUser/UserFileList.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/inspection",
            component: () => import("./components/ContentUser/UserInspectionList.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/inspection-counter",
            component: () => import("./components/ContentUser/UserInspectionCounterList.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/construction/:id",
            component: () => import("./components/ContentUser/UserConstructionDetail.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/inspection/:id",
            component: () => import("./components/ContentUser/UserInspectionDetail.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/dashboard/inspection-counter/:id",
            component: () => import("./components/ContentUser/UserInspectionCounterDetail.vue"),
            meta: { requiresAuth: true }
        },


        // Page for Public
        {
            path: "/",
            component: () => import("./components/ContentHome/Home.vue"),
        },
        {
            path: "/home",
            redirect: "/",
        },
        {
            path: "/home/construction",
            component: () => import("./components/ContentHome/ConstructionList.vue"),
        },
        {
            path: "/home/construction/:id",
            component: () => import("./components/ContentHome/ConstructionDetail.vue"),
        },
        {
            path: "/home/inspection",
            component: () => import("./components/ContentHome/InspectionList.vue"),
        },
        {
            path: "/home/inspection/:id",
            component: () => import("./components/ContentHome/InspectionDetail.vue"),
        },
        {
            path: "/home/files",
            component: () => import("./components/ContentHome/FilesList.vue"),
        },
        {
            path: "/home/files/:fileType",
            component: () => import("./components/ContentHome/FilesList.vue"),
        },
        {
            path: "/home/inspection-counter",
            component: () => import("./components/ContentHome/InspectionCounterList.vue"),
        },
        {
            path: "/home/inspection-counter/:id",
            component: () => import("./components/ContentHome/InspectionCounterDetail.vue"),
        },
        {
            path: "/users/logout",
            component: () => import("./components/User/UserLogout.vue"),
        }
    ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token")

    if (to.meta.requiresAuth && !token) {
        next("/login")
    } else {
        next()
    }
})

createApp(App).use(router).mount('#app')
