<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudents } from "@/composables/useStudents";
import { useTags } from "@/composables/useTags";

const route = useRoute();
const router = useRouter();
const { students, useStudentById, updateStudent, setStudentTags, deleteStudent } = useStudents();
const { tags } = useTags();

const studentId = computed(() => Number(route.params.studentId));
const student = useStudentById(studentId);

const studentName = ref("");
const selectedTagIds = ref([]);
const formError = ref("");
const isSaving = ref(false);
const isDeleting = ref(false);

watch(
	student,
	(nextStudent) => {
		if (!nextStudent) {
			return;
		}

		studentName.value = nextStudent.name;
		selectedTagIds.value = nextStudent.tags.map((tag) => tag.id);
	},
	{ immediate: true }
);

const tagButtonLabel = computed(() => {
	if (selectedTagIds.value.length === 0) {
		return "No tags selected";
	}

	if (selectedTagIds.value.length === 1) {
		const selectedTag = tags.value.find((tag) => tag.id === selectedTagIds.value[0]);
		return selectedTag?.name || "1 tag selected";
	}

	return `${selectedTagIds.value.length} tags selected`;
});

function isTagSelected(tagId) {
	return selectedTagIds.value.includes(tagId);
}

function toggleTag(tagId) {
	if (isTagSelected(tagId)) {
		selectedTagIds.value = selectedTagIds.value.filter((selectedTagId) => selectedTagId !== tagId);
		return;
	}

	selectedTagIds.value = [...selectedTagIds.value, tagId];
}

async function handleSave() {
	formError.value = "";

	const trimmedName = studentName.value.trim();

	if (!trimmedName) {
		formError.value = "Please enter a student name.";
		return;
	}

	if (
		students.value.some(
			(otherStudent) =>
				otherStudent.id !== studentId.value && otherStudent.name.toLowerCase() === trimmedName.toLowerCase()
		)
	) {
		formError.value = "This student already exists.";
		return;
	}

	isSaving.value = true;

	try {
		await updateStudent(studentId.value, { name: trimmedName });
		await setStudentTags(studentId.value, selectedTagIds.value);
	} catch {
		formError.value = "Unable to save student. Please try again.";
	} finally {
		isSaving.value = false;
	}
}

async function handleDelete() {
	if (!confirm(`Delete ${student.value?.name}? This cannot be undone.`)) {
		return;
	}

	isDeleting.value = true;

	try {
		await deleteStudent(studentId.value);
		await router.push({ name: "students" });
	} finally {
		isDeleting.value = false;
	}
}
</script>

<template>
	<div class="row justify-content-center">
		<div class="col-md-8 col-lg-7">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h1 class="mb-0">Student</h1>
				<RouterLink class="btn btn-outline-secondary btn-sm" :to="{ name: 'students' }">
					Back to Students
				</RouterLink>
			</div>

			<div v-if="student === undefined" class="alert alert-light border mb-0">
				Loading student...
			</div>

			<div v-else-if="!student" class="alert alert-warning mb-0">
				Student not found.
			</div>

			<div v-else class="card border-0 bg-light-subtle mb-3">
				<div class="card-body">
					<form class="row g-3" @submit.prevent="handleSave">
						<div class="col-12">
							<label for="student-name" class="form-label">Student name</label>
							<input
								id="student-name"
								v-model="studentName"
								type="text"
								class="form-control"
								placeholder="e.g. Aryan"
								required
							/>
						</div>

						<div class="col-12">
							<span class="form-label fw-semibold mb-2 d-block">Tags</span>

							<div class="dropdown" data-bs-auto-close="outside">
								<button
									id="student-tags"
									class="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
									type="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<span>{{ tagButtonLabel }}</span>
								</button>
								<ul class="dropdown-menu w-100 p-2">
									<li v-if="tags.length === 0" class="dropdown-item-text text-body-secondary small">
										No tags available
									</li>
									<li v-for="tag in tags" :key="tag.id">
										<label class="dropdown-item d-flex align-items-center gap-2 rounded">
											<input
												class="form-check-input mt-0"
												type="checkbox"
												:value="tag.id"
												:checked="isTagSelected(tag.id)"
												@change="toggleTag(tag.id)"
											/>
											<span>{{ tag.name }}</span>
										</label>
									</li>
								</ul>
							</div>
						</div>

						<div class="col-12 d-flex align-items-center justify-content-between gap-3">
							<div class="d-flex align-items-center gap-3">
								<button type="submit" class="btn btn-primary" :disabled="isSaving">
									{{ isSaving ? "Saving..." : "Save" }}
								</button>
								<span v-if="formError" class="text-danger small">{{ formError }}</span>
							</div>

							<button
								type="button"
								class="btn btn-outline-danger btn-sm"
								:disabled="isDeleting"
								@click="handleDelete"
							>
								{{ isDeleting ? "Deleting..." : "Delete student" }}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
