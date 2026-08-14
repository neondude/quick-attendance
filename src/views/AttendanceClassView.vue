<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClasses } from "@/composables/useClasses";
import { useStudents } from "@/composables/useStudents";
import DateScrollPicker from "@/components/DateScrollPicker.vue";
import { db } from "@/db";

const route = useRoute();
const router = useRouter();
const { useClassById } = useClasses();
const { students } = useStudents();

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function compareIsoDates(leftIsoDate, rightIsoDate) {
  const leftDate = new Date(`${leftIsoDate}T00:00:00`);
  const rightDate = new Date(`${rightIsoDate}T00:00:00`);
  return leftDate.getTime() - rightDate.getTime();
}

const classId = computed(() => Number(route.params.classId));
const todayIso = toIsoDate(new Date());

function sanitizeQueryDate(queryDate) {
  if (!isIsoDate(queryDate)) {
    return todayIso;
  }

  if (compareIsoDates(queryDate, todayIso) > 0) {
    return todayIso;
  }

  return queryDate;
}

const selectedDate = ref(sanitizeQueryDate(route.query.date));

const selectedClass = useClassById(classId);

const displayDate = computed(() => formatDisplayDate(selectedDate.value));
const backLink = computed(() => ({
  name: "attendance",
  query: { date: selectedDate.value },
}));

const attendanceForSelectedDay = ref([]);

async function loadAttendanceForSelectedDay() {
  if (!Number.isFinite(classId.value)) {
    attendanceForSelectedDay.value = [];
    return;
  }

  attendanceForSelectedDay.value = await db.attendance
    .where("[date+classId]")
    .equals([selectedDate.value, classId.value])
    .toArray();
}

const attendanceByStudentId = computed(() => {
  const byStudentId = new Map();

  for (const row of attendanceForSelectedDay.value) {
    byStudentId.set(row.studentId, row);
  }

  return byStudentId;
});

const studentsWithAttendance = computed(() =>
  students.value.map((student) => {
    const attendanceRow = attendanceByStudentId.value.get(student.id);
    const status = attendanceRow?.status === "absent" ? "absent" : attendanceRow ? "present" : "unknown";

    return {
      ...student,
      status,
    };
  })
);

watch(selectedDate, async (nextDate) => {
  if (compareIsoDates(nextDate, todayIso) > 0) {
    selectedDate.value = todayIso;
    return;
  }

  await router.replace({
    params: route.params,
    query: {
      ...route.query,
      date: nextDate,
    },
  });
});

watch(
  () => route.query.date,
  async (queryDate) => {
    const safeDate = sanitizeQueryDate(queryDate);

    if (safeDate !== selectedDate.value) {
      selectedDate.value = safeDate;
      return;
    }

    if (queryDate !== safeDate) {
      await router.replace({
        params: route.params,
        query: {
          ...route.query,
          date: safeDate,
        },
      });
    }
  },
  { immediate: true }
);

watch(
  [selectedDate, classId],
  async () => {
    await loadAttendanceForSelectedDay();
  },
  { immediate: true }
);

async function findAttendanceRow(studentId) {
  const rows = await db.attendance
    .where("[date+classId]")
    .equals([selectedDate.value, classId.value])
    .toArray();

  return rows.find((row) => row.studentId === studentId);
}

async function markAttendance(studentId, nextStatus) {
  if (!Number.isFinite(classId.value)) {
    return;
  }

  const existing = await findAttendanceRow(studentId);

  if (nextStatus === "unknown") {
    if (existing) {
      await db.attendance.delete(existing.id);
    }
    await loadAttendanceForSelectedDay();
    return;
  }

  if (existing) {
    await db.attendance.update(existing.id, { status: nextStatus });
    await loadAttendanceForSelectedDay();
    return;
  }

  await db.attendance.add({
    studentId,
    classId: classId.value,
    date: selectedDate.value,
    status: nextStatus,
  });

  await loadAttendanceForSelectedDay();
}

function statusButtonClass(studentStatus, buttonStatus) {
  if (studentStatus === buttonStatus) {
    if (buttonStatus === "present") {
      return "btn-success";
    }

    if (buttonStatus === "absent") {
      return "btn-danger";
    }

    return "btn-secondary";
  }

  if (buttonStatus === "present") {
    return "btn-outline-success";
  }

  if (buttonStatus === "absent") {
    return "btn-outline-danger";
  }

  return "btn-outline-secondary";
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-7">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="mb-0">Class Attendance</h1>
        <RouterLink class="btn btn-outline-secondary btn-sm" :to="backLink">
          Back to Attendance
        </RouterLink>
      </div>

      <div v-if="selectedClass === undefined" class="alert alert-light border mb-0">
        Loading class...
      </div>

      <div v-else-if="!selectedClass" class="alert alert-warning mb-0">
        Class not found.
      </div>

      <div v-else>
        <div class="card border-0 bg-light-subtle mb-3">
          <div class="card-body py-3">
            <h2 class="h5 mb-3">{{ selectedClass.name }}</h2>
            <DateScrollPicker
              v-model="selectedDate"
              :max-date="todayIso"
              input-aria-label="Attendance date"
            />
            <div class="small text-body-secondary mt-2">
              {{ selectedClass.time }} | {{ displayDate }}
            </div>
          </div>
        </div>

        <div v-if="studentsWithAttendance.length === 0" class="alert alert-light border mb-0">
          No students found.
        </div>

        <div v-else class="list-group attendance-student-list">
          <div
            v-for="student in studentsWithAttendance"
            :key="student.id"
            class="list-group-item student-row"
          >
            <div class="fw-semibold">{{ student.name }}</div>
            <div class="d-flex flex-wrap gap-1 student-actions" :aria-label="`Attendance status for ${student.name}`">
              <button
                type="button"
                class="btn btn-sm"
                :class="statusButtonClass(student.status, 'present')"
                @click="markAttendance(student.id, 'present')"
              >
                ✔ Present
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="statusButtonClass(student.status, 'absent')"
                @click="markAttendance(student.id, 'absent')"
              >
                ❌ Absent
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="statusButtonClass(student.status, 'unknown')"
                @click="markAttendance(student.id, 'unknown')"
              >
                ? Unknown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attendance-student-list {
  display: grid;
  gap: 0.5rem;
}

.student-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.student-actions {
  margin-top: 0.5rem;
}

@media (min-width: 576px) {
  .student-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .student-actions {
    margin-top: 0;
  }
}
</style>
