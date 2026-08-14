<script setup>
import { useStudents } from "@/composables/useStudents";

const { studentsWithTags } = useStudents();
</script>

<template>
	<div class="row justify-content-center">
		<div class="col-md-8 col-lg-7">
			<h1 class="mb-3">Students</h1>

			<div v-if="studentsWithTags.length === 0" class="alert alert-light border mb-0">
				No students found.
			</div>

			<div v-else class="list-group">
				<div
					v-for="student in studentsWithTags"
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
