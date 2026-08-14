import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "@/db";

export function useStudents() {
  const students = useObservable(
    liveQuery(() => db.students.toArray()),
    { initialValue: [] }
  );

  const studentsWithTags = useObservable(
    liveQuery(async () => {
      const [studentsList, tagsList, studentTagLinks] = await Promise.all([
        db.students.toArray(),
        db.tags.toArray(),
        db.studentTags.toArray(),
      ]);

      const tagNameById = new Map(tagsList.map((tag) => [tag.id, tag.name]));
      const tagNamesByStudentId = new Map();

      for (const link of studentTagLinks) {
        const tagName = tagNameById.get(link.tagId);
        if (!tagName) {
          continue;
        }

        if (!tagNamesByStudentId.has(link.studentId)) {
          tagNamesByStudentId.set(link.studentId, []);
        }

        tagNamesByStudentId.get(link.studentId).push(tagName);
      }

      return studentsList.map((student) => {
        const tags = tagNamesByStudentId.get(student.id) || [];
        return {
          ...student,
          tags,
        };
      });
    }),
    { initialValue: [] }
  );

  async function addStudent(student) {
    return db.students.add(student);
  }

  async function updateStudent(id, changes) {
    return db.students.update(id, changes);
  }

  async function deleteStudent(id) {
    return db.students.delete(id);
  }

  async function getStudent(id) {
    return db.students.get(id);
  }

  return {
    students,
    studentsWithTags,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
  };
}