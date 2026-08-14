import { createRouter, createWebHistory } from "vue-router";
import AttendanceView from "@/views/AttendanceView.vue";
import StudentsView from "@/views/StudentsView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ClassesSettingsView from "@/views/ClassesSettingsView.vue";
import TagsSettingsView from "@/views/TagsSettingsView.vue";
import AttendanceClassView from "@/views/AttendanceClassView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH || "/"),
  linkActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "home",
      component: StudentsView,
    },
    {
      path: "/attendance",
      name: "attendance",
      component: AttendanceView,
    },
    {
      path: "/attendance/:classId",
      name: "attendance-class",
      component: AttendanceClassView,
    },
    {
      path: "/students",
      name: "students",
      component: StudentsView,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
    {
      path: "/settings/classes",
      name: "settings-classes",
      component: ClassesSettingsView,
    },
    {
      path: "/settings/tags",
      name: "settings-tags",
      component: TagsSettingsView,
    },
  ],
});

export default router;
