<script setup>
import { onMounted } from "vue";
import { db } from "@/db";

onMounted(async () => {
  console.log("Database:", db.name);
});

</script>

<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary border-bottom">
    <div class="container-md">
      <RouterLink class="navbar-brand fw-semibold" to="/">Attendance</RouterLink>
      <div class="navbar-nav flex-row gap-1">
        <RouterLink class="btn px-3" to="/students">Students</RouterLink>
        <RouterLink class="btn px-3" to="/about">About</RouterLink>
      </div>
    </div>
  </nav>
  <div class="container-md py-4">
    <RouterView />
  </div>
</template>

<style scoped></style>
