<script setup>
import { provide, ref, watch } from "vue";

function createInitialState() {
  return {
    count: 0,
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "RESET":
      return createInitialState();
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
