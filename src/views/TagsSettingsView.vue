<script setup>
import { ref } from "vue";
import { useTags } from "@/composables/useTags";

const { tags, addTag } = useTags();

const tagName = ref("");
const formError = ref("");
const isSaving = ref(false);

async function handleSubmit() {
  formError.value = "";

  const trimmedName = tagName.value.trim();

  if (!trimmedName) {
    formError.value = "Please enter a tag name.";
    return;
  }

  if (tags.value.some((tag) => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
    formError.value = "This tag already exists.";
    return;
  }

  isSaving.value = true;

  try {
    await addTag({
      name: trimmedName,
    });

    tagName.value = "";
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-7">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="mb-0">Tags</h1>
        <RouterLink class="btn btn-outline-secondary btn-sm" to="/settings">Back to Settings</RouterLink>
      </div>

      <div class="card border-0 bg-light-subtle mb-4">
        <div class="card-body">
          <h2 class="h6 mb-3">Add tag</h2>

          <form class="row g-3" @submit.prevent="handleSubmit">
            <div class="col-12">
              <label for="tag-name" class="form-label">Tag name</label>
              <input
                id="tag-name"
                v-model="tagName"
                type="text"
                class="form-control"
                placeholder="e.g. Beginner"
                required
              />
            </div>

            <div class="col-12 d-flex align-items-center gap-3">
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                {{ isSaving ? "Saving..." : "Add tag" }}
              </button>
              <span v-if="formError" class="text-danger small">{{ formError }}</span>
            </div>
          </form>
        </div>
      </div>

      <h2 class="h5 mb-3">Tag list</h2>

      <div v-if="tags.length === 0" class="alert alert-light border mb-0">
        No tags added yet.
      </div>

      <div v-else class="list-group">
        <div v-for="tag in tags" :key="tag.id" class="list-group-item">
          <div class="fw-semibold">{{ tag.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>