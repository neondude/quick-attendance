import { createRouter, createWebHistory } from "vue-router";
import StudentsView from "@/views/StudentsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH || "/"),
  linkActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "students",
      component: StudentsView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/students",
      name: "students",
      component: StudentsView,
    },
  ],
});

export default router;
