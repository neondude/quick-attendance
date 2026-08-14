import Dexie from "dexie";

export const db = new Dexie("attendance-db");

db.version(1).stores({
  students: "++id, name",
  tags: "++id, name",
  studentTags: "++id, studentId, tagId, [studentId+tagId]",
  classes: "++id, name, time",
  attendance: "++id, studentId, classId, date, [date+classId]",
});