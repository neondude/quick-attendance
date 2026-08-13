<script setup>
import { inject } from "vue";

const state = inject("state");
const dispatch = inject("dispatch");
</script>

<template>
  <div class="card">
    <div class="card-body text-center">
      <h5 class="card-title mb-3">Counter Demo</h5>
      <p class="display-4 mb-4">{{ state.count }}</p>
      <div class="d-flex justify-content-center gap-2">
        <button class="btn btn-outline-secondary" @click="dispatch({ type: 'DECREMENT' })">−</button>
        <button class="btn btn-primary" @click="dispatch({ type: 'INCREMENT' })">+</button>
        <button class="btn btn-outline-danger" @click="dispatch({ type: 'RESET' })">Reset</button>
      </div>
      <p class="text-muted mt-3 small">State is persisted to <code>localStorage</code> on every change.</p>
    </div>
  </div>
</template>
