<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  maxDate: {
    type: String,
    default: null,
  },
  inputAriaLabel: {
    type: String,
    default: "Attendance date",
  },
  previousAriaLabel: {
    type: String,
    default: "Previous day",
  },
  nextAriaLabel: {
    type: String,
    default: "Next day",
  },
});

const emit = defineEmits(["update:modelValue"]);

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(isoDate, days) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const nextDate = new Date(year, month - 1, day);
  nextDate.setDate(nextDate.getDate() + days);
  return toIsoDate(nextDate);
}

function compareIsoDates(leftIsoDate, rightIsoDate) {
  const leftDate = new Date(`${leftIsoDate}T00:00:00`);
  const rightDate = new Date(`${rightIsoDate}T00:00:00`);
  return leftDate.getTime() - rightDate.getTime();
}

const isNextDisabled = computed(() => {
  if (!props.maxDate) {
    return false;
  }

  return compareIsoDates(props.modelValue, props.maxDate) >= 0;
});

function goPreviousDay() {
  emit("update:modelValue", addDays(props.modelValue, -1));
}

function goNextDay() {
  if (isNextDisabled.value) {
    return;
  }

  emit("update:modelValue", addDays(props.modelValue, 1));
}

function handleDateInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <div class="d-flex align-items-center gap-2">
    <button
      type="button"
      class="btn btn-outline-secondary"
      :aria-label="previousAriaLabel"
      @click="goPreviousDay"
    >
      &larr;
    </button>

    <input
      :value="modelValue"
      type="date"
      class="form-control"
      :aria-label="inputAriaLabel"
      @input="handleDateInput"
    />

    <button
      type="button"
      class="btn btn-outline-secondary"
      :aria-label="nextAriaLabel"
      :disabled="isNextDisabled"
      @click="goNextDay"
    >
      &rarr;
    </button>
  </div>
</template>
