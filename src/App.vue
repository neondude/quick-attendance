<script setup>
import { provide, ref, watch } from "vue";

function createInitialState() {
  /* schema for the state object 
{
  "tags": [
    {
      "id": "tag-mwf",
      "name": "MWF"
    },
    {
      "id": "tag-tts",
      "name": "TTS"
    },
    {
      "id": "tag-6am",
      "name": "6 AM"
    },
    {
      "id": "tag-7am",
      "name": "7 AM"
    }
  ],
  "classes": [
    {
      "id": "class-1",
      "name": "Class 1"
    },
    {
      "id": "class-2",
      "name": "Class 2"
    },
    {
      "id": "class-3",
      "name": "Class 3"
    }
  ],
  "people": [
    {
      "id": "person-001",
      "name": "Arun",
      "tagIds": ["tag-mwf", "tag-6am"]
    },
    {
      "id": "person-002",
      "name": "Priya",
      "tagIds": ["tag-mwf", "tag-7am"]
    },
    {
      "id": "person-003",
      "name": "Rahul",
      "tagIds": ["tag-tts", "tag-6am"]
    }
  ],
  "attendance": {
    "2026-08-14": {
      "class-1": ["person-001"],
      "class-2": ["person-002"]
    }
  }
}
  */
  
  return {
    tags: [],
    classes: [],
    people: [],
    attendance: {}
  };
}

function appReducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const savedState = localStorage.getItem("appState");
const initialState = savedState ? JSON.parse(savedState) : createInitialState();

const state = ref(initialState);

function dispatch(action) {
  state.value = appReducer(state.value, action);
}

provide("state", state);
provide("dispatch", dispatch);

watch(
  state,
  (newState) => {
    localStorage.setItem("appState", JSON.stringify(newState));
  },
  { deep: true },
);
</script>

<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary border-bottom">
    <div class="container-md">
      <RouterLink class="navbar-brand fw-semibold" to="/">Vue Boilerplate</RouterLink>
      <div class="navbar-nav flex-row gap-1">
        <RouterLink class="btn px-3" to="/">Home</RouterLink>
        <RouterLink class="btn px-3" to="/about">About</RouterLink>
      </div>
    </div>
  </nav>
  <div class="container-md py-4">
    <RouterView />
  </div>
</template>

<style scoped></style>
