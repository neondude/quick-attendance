<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClasses } from "@/composables/useClasses";
import DateScrollPicker from "@/components/DateScrollPicker.vue";
import { db } from "@/db";

const route = useRoute();
const router = useRouter();
const { classes } = useClasses();

function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function isIsoDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
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
const attendanceRowsForSelectedDate = ref([]);

const displayDate = computed(() => formatDisplayDate(selectedDate.value));

const attendanceCountsByClassId = computed(() => {
    const byClassId = new Map();

    for (const row of attendanceRowsForSelectedDate.value) {
        if (!byClassId.has(row.classId)) {
            byClassId.set(row.classId, { present: 0, absent: 0 });
        }

        const counts = byClassId.get(row.classId);
        if (row.status === "absent") {
            counts.absent += 1;
        } else {
            // Legacy rows without explicit status are considered present.
            counts.present += 1;
        }
    }

    return byClassId;
});

function countsForClass(classId) {
    return attendanceCountsByClassId.value.get(classId) || { present: 0, absent: 0 };
}

async function loadAttendanceForSelectedDate() {
    attendanceRowsForSelectedDate.value = await db.attendance
        .where("date")
        .equals(selectedDate.value)
        .toArray();
}

watch(selectedDate, async (nextDate) => {
    if (compareIsoDates(nextDate, todayIso) > 0) {
        selectedDate.value = todayIso;
        return;
    }

    await router.replace({
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
    selectedDate,
    async () => {
        await loadAttendanceForSelectedDate();
    },
    { immediate: true }
);
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-7">
            <h1 class="mb-3">Attendance</h1>

            <div class="card border-0 bg-light-subtle mb-4">
                <div class="card-body py-3">
                    <DateScrollPicker
                        v-model="selectedDate"
                        :max-date="todayIso"
                        input-aria-label="Attendance date"
                    />

                    <div class="small text-body-secondary mt-2">{{ displayDate }}</div>
                </div>
            </div>

            <h2 class="h5 mb-3">Classes</h2>

            <div v-if="classes.length === 0" class="alert alert-light border mb-0">
                No classes added yet.
            </div>

            <div v-else class="list-group">
                <RouterLink
                    v-for="classItem in classes"
                    :key="classItem.id"
                    class="list-group-item list-group-item-action"
                    :to="{
                        name: 'attendance-class',
                        params: { classId: classItem.id },
                        query: { date: selectedDate },
                    }"
                >
                    <div class="fw-semibold">{{ classItem.name }}</div>
                    <div class="small text-body-secondary mt-1">{{ classItem.time }}</div>
                    <div class="d-flex flex-wrap gap-1 mt-2">
                        <span class="badge rounded-pill text-bg-success">
                            Present {{ countsForClass(classItem.id).present }}
                        </span>
                        <span class="badge rounded-pill text-bg-danger">
                            Absent {{ countsForClass(classItem.id).absent }}
                        </span>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>