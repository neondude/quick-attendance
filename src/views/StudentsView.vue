<script setup>
import { computed, ref } from "vue";
import { useStudents } from "@/composables/useStudents";

const { studentsWithTags } = useStudents();
const selectedTags = ref([]);

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
	if (selectedTags.value.length === 0) {
		return studentsWithTags.value;
	}

	return studentsWithTags.value.filter((student) =>
		student.tags.some((tag) => selectedTags.value.includes(tag))
	);
});

const tagFilterButtonLabel = computed(() => {
	if (selectedTags.value.length === 0) {
		return "All tags";
	}

	if (selectedTags.value.length === 1) {
		return selectedTags.value[0];
	}

	return `${selectedTags.value.length} tags selected`;
});

function isTagSelected(tag) {
	return selectedTags.value.includes(tag);
}

function toggleTag(tag) {
	if (isTagSelected(tag)) {
		selectedTags.value = selectedTags.value.filter((selectedTag) => selectedTag !== tag);
		return;
	}

	selectedTags.value = [...selectedTags.value, tag];
}

function clearTagFilters() {
	selectedTags.value = [];
}
</script>

<template>
	<div class="row justify-content-center">
		<div class="col-md-8 col-lg-7">
			<h1 class="mb-3">Students</h1>

			<div class="card border-0 bg-light-subtle mb-3">
				<div class="card-body py-3">
					<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
						<span class="form-label fw-semibold mb-0">Filter by tags</span>
						<button
							v-if="selectedTags.length > 0"
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
										:checked="isTagSelected(tag)"
										@change="toggleTag(tag)"
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
