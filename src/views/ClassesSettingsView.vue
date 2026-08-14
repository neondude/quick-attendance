<script setup>
import { ref } from "vue";
import { useClasses } from "@/composables/useClasses";

const { classes, addClass } = useClasses();

const className = ref("");
const classTime = ref("");
const formError = ref("");
const isSaving = ref(false);

async function handleSubmit() {
  formError.value = "";

  const trimmedName = className.value.trim();
  const trimmedTime = classTime.value.trim();

  if (!trimmedName || !trimmedTime) {
    formError.value = "Please enter both class name and time.";
    return;
  }

  isSaving.value = true;

  try {
    await addClass({
      name: trimmedName,
      time: trimmedTime,
    });

    className.value = "";
    classTime.value = "";
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-7">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="mb-0">Classes</h1>
        <RouterLink class="btn btn-outline-secondary btn-sm" to="/settings">Back to Settings</RouterLink>
      </div>

      <div class="card border-0 bg-light-subtle mb-4">
        <div class="card-body">
          <h2 class="h6 mb-3">Add class</h2>

          <form class="row g-3" @submit.prevent="handleSubmit">
            <div class="col-12">
              <label for="class-name" class="form-label">Class name</label>
              <input
                id="class-name"
                v-model="className"
                type="text"
                class="form-control"
                placeholder="e.g. Math 101"
                required
              />
            </div>

            <div class="col-12 col-sm-6">
              <label for="class-time" class="form-label">Class time</label>
              <input
                id="class-time"
                v-model="classTime"
                type="time"
                class="form-control"
                required
              />
            </div>

            <div class="col-12 d-flex align-items-center gap-3">
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                {{ isSaving ? "Saving..." : "Add class" }}
              </button>
              <span v-if="formError" class="text-danger small">{{ formError }}</span>
            </div>
          </form>
        </div>
      </div>

      <h2 class="h5 mb-3">Class list</h2>

      <div v-if="classes.length === 0" class="alert alert-light border mb-0">
        No classes added yet.
      </div>

      <div v-else class="list-group">
        <div v-for="classItem in classes" :key="classItem.id" class="list-group-item">
          <div class="fw-semibold">{{ classItem.name }}</div>
          <div class="small text-body-secondary mt-1">{{ classItem.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>