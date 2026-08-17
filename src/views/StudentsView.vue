<script setup>
import { computed, ref } from "vue";
import { useStudents } from "@/composables/useStudents";
import { useTags } from "@/composables/useTags";

const { students, studentsWithTags, addStudent, attachTagsToStudent } = useStudents();
const { tags } = useTags();

const studentName = ref("");
const selectedCreateTagIds = ref([]);
const formError = ref("");
const isSaving = ref(false);

const selectedFilterTags = ref([]);

const availableTags = computed(() => {
	const uniqueTags = new Set();

	for (const student of studentsWithTags.value) {
		for (const tag of student.tags) {
			uniqueTags.add(tag);
		}
	}

	return Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));
});

const filteredStudents = computed(() => {
	if (selectedFilterTags.value.length === 0) {
		return studentsWithTags.value;
	}

	return studentsWithTags.value.filter((student) =>
		student.tags.some((tag) => selectedFilterTags.value.includes(tag))
	);
});

const tagFilterButtonLabel = computed(() => {
	if (selectedFilterTags.value.length === 0) {
		return "All tags";
	}

	if (selectedFilterTags.value.length === 1) {
		return selectedFilterTags.value[0];
	}

	return `${selectedFilterTags.value.length} tags selected`;
});

const createTagButtonLabel = computed(() => {
	if (selectedCreateTagIds.value.length === 0) {
		return "No tags selected";
	}

	if (selectedCreateTagIds.value.length === 1) {
		const selectedTag = tags.value.find((tag) => tag.id === selectedCreateTagIds.value[0]);
		return selectedTag?.name || "1 tag selected";
	}

	return `${selectedCreateTagIds.value.length} tags selected`;
});

function isFilterTagSelected(tag) {
	return selectedFilterTags.value.includes(tag);
}

function toggleFilterTag(tag) {
	if (isFilterTagSelected(tag)) {
		selectedFilterTags.value = selectedFilterTags.value.filter((selectedTag) => selectedTag !== tag);
		return;
	}

	selectedFilterTags.value = [...selectedFilterTags.value, tag];
}

function clearTagFilters() {
	selectedFilterTags.value = [];
}

function isCreateTagSelected(tagId) {
	return selectedCreateTagIds.value.includes(tagId);
}

function toggleCreateTag(tagId) {
	if (isCreateTagSelected(tagId)) {
		selectedCreateTagIds.value = selectedCreateTagIds.value.filter((selectedTagId) => selectedTagId !== tagId);
		return;
	}

	selectedCreateTagIds.value = [...selectedCreateTagIds.value, tagId];
}

function clearCreateTagSelection() {
	selectedCreateTagIds.value = [];
}

async function handleAddStudent() {
	formError.value = "";

	const trimmedName = studentName.value.trim();

	if (!trimmedName) {
		formError.value = "Please enter a student name.";
		return;
	}

	if (students.value.some((student) => student.name.toLowerCase() === trimmedName.toLowerCase())) {
		formError.value = "This student already exists.";
		return;
	}

	isSaving.value = true;

	try {
		const studentId = await addStudent({
			name: trimmedName,
		});

		if (selectedCreateTagIds.value.length > 0) {
			await attachTagsToStudent(studentId, selectedCreateTagIds.value);
		}

		studentName.value = "";
		selectedCreateTagIds.value = [];
	} catch {
		formError.value = "Unable to add student. Please try again.";
	} finally {
		isSaving.value = false;
	}
}
</script>

<template>
	<div class="row justify-content-center">
		<div class="col-md-8 col-lg-7">
			<h1 class="mb-3">Students</h1>

			<div class="card border-0 bg-light-subtle mb-3">
				<div class="card-body">
					<h2 class="h6 mb-3">Add student</h2>

					<form class="row g-3" @submit.prevent="handleAddStudent">
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
							<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
								<span class="form-label fw-semibold mb-0">Tags</span>
								<button
									v-if="selectedCreateTagIds.length > 0"
									type="button"
									class="btn btn-sm btn-outline-secondary"
									@click="clearCreateTagSelection"
								>
									Clear
								</button>
							</div>

							<div class="dropdown" data-bs-auto-close="outside">
								<button
									id="student-tags"
									class="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
									type="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<span>{{ createTagButtonLabel }}</span>
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
												:checked="isCreateTagSelected(tag.id)"
												@change="toggleCreateTag(tag.id)"
											/>
											<span>{{ tag.name }}</span>
										</label>
									</li>
								</ul>
							</div>

							<div class="form-text">Tags are optional when adding a student.</div>
						</div>

						<div class="col-12 d-flex align-items-center gap-3">
							<button type="submit" class="btn btn-primary" :disabled="isSaving">
								{{ isSaving ? "Saving..." : "Add student" }}
							</button>
							<span v-if="formError" class="text-danger small">{{ formError }}</span>
						</div>
					</form>
				</div>
			</div>

			<div class="card border-0 bg-light-subtle mb-3">
				<div class="card-body py-3">
					<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
						<span class="form-label fw-semibold mb-0">Filter by tags</span>
						<button
							v-if="selectedFilterTags.length > 0"
							type="button"
							class="btn btn-sm btn-outline-secondary"
							@click="clearTagFilters"
						>
							Clear
						</button>
					</div>

					<div class="dropdown" data-bs-auto-close="outside">
						<button
							id="tag-filter"
							class="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<span>{{ tagFilterButtonLabel }}</span>
						</button>
						<ul class="dropdown-menu w-100 p-2">
							<li v-if="availableTags.length === 0" class="dropdown-item-text text-body-secondary small">
								No tags available
							</li>
							<li v-for="tag in availableTags" :key="tag">
								<label class="dropdown-item d-flex align-items-center gap-2 rounded">
									<input
										class="form-check-input mt-0"
										type="checkbox"
										:value="tag"
										:checked="isFilterTagSelected(tag)"
										@change="toggleFilterTag(tag)"
									/>
									<span>{{ tag }}</span>
								</label>
							</li>
						</ul>
					</div>

					<div class="form-text">Select one or more tags from the dropdown.</div>
				</div>
			</div>

			<div v-if="filteredStudents.length === 0" class="alert alert-light border mb-0">
				No students found.
			</div>

			<div v-else class="list-group">
				<div
					v-for="student in filteredStudents"
					:key="student.id"
					class="list-group-item"
				>
					<div class="fw-semibold">{{ student.name }}</div>
					<div class="mt-2">
						<span v-if="student.tags.length === 0" class="small text-body-secondary">
							No tags
						</span>
						<div v-else class="d-flex flex-wrap gap-1">
							<span
								v-for="tag in student.tags"
								:key="`${student.id}-${tag}`"
								class="badge rounded-pill text-bg-light border"
							>
								{{ tag }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
