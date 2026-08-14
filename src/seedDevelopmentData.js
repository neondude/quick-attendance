import { db } from "@/db";

const TAG_NAMES = ["MWF", "TTS", "5AM", "6AM", "7AM"];

const STUDENTS = [
  { name: "Arun Kumar" },
  { name: "Priya S" },
  { name: "Ravi Kumar" },
  { name: "Divya R" },
  { name: "Karthik M" },
  { name: "Anjali P" },
];

const STUDENT_TAG_RELATIONS = [
  { studentIndex: 0, tagIndex: 0 },
  { studentIndex: 0, tagIndex: 2 },
  { studentIndex: 1, tagIndex: 0 },
  { studentIndex: 1, tagIndex: 3 },
  { studentIndex: 2, tagIndex: 0 },
  { studentIndex: 2, tagIndex: 4 },
  { studentIndex: 3, tagIndex: 1 },
  { studentIndex: 3, tagIndex: 2 },
  { studentIndex: 4, tagIndex: 1 },
  { studentIndex: 4, tagIndex: 4 },
  { studentIndex: 5, tagIndex: 1 },
  { studentIndex: 5, tagIndex: 3 },
];

const CLASSES = [
  { name: "5 AM Batch", time: "05:00" },
  { name: "6 AM Batch", time: "06:00" },
  { name: "7 AM Batch", time: "07:00" },
];

const ATTENDANCE_ROWS = [
  { studentIndex: 0, classIndex: 0, date: "2026-08-14" },
  { studentIndex: 1, classIndex: 1, date: "2026-08-14" },
  { studentIndex: 3, classIndex: 2, date: "2026-08-14" },
];

export async function seedDevelopmentData() {
  console.info("[seed] Dropping and recreating database before seeding...");

  db.close();
  await db.delete();
  await db.open();

  console.info("[seed] Resetting students, tags, studentTags, classes, and attendance...");

  await db.transaction(
    "rw",
    db.students,
    db.tags,
    db.studentTags,
    db.classes,
    db.attendance,
    async () => {
    await Promise.all([
      db.attendance.clear(),
      db.classes.clear(),
      db.studentTags.clear(),
      db.students.clear(),
      db.tags.clear(),
    ]);

    const tagIds = await db.tags.bulkAdd(
      TAG_NAMES.map((name) => ({ name })),
      { allKeys: true }
    );

    const studentIds = await db.students.bulkAdd(
      STUDENTS,
      { allKeys: true }
    );

    await db.studentTags.bulkAdd(
      STUDENT_TAG_RELATIONS.map(({ studentIndex, tagIndex }) => ({
        studentId: studentIds[studentIndex],
        tagId: tagIds[tagIndex],
      }))
    );

      const classIds = await db.classes.bulkAdd(CLASSES, { allKeys: true });

      await db.attendance.bulkAdd(
        ATTENDANCE_ROWS.map(({ studentIndex, classIndex, date }) => ({
          studentId: studentIds[studentIndex],
          classId: classIds[classIndex],
          date,
        }))
      );
    }
  );

  const [studentCount, tagCount, studentTagCount, classCount, attendanceCount] = await Promise.all([
    db.students.count(),
    db.tags.count(),
    db.studentTags.count(),
    db.classes.count(),
    db.attendance.count(),
  ]);

  console.info(
    `[seed] Done. students=${studentCount}, tags=${tagCount}, studentTags=${studentTagCount}, classes=${classCount}, attendance=${attendanceCount}`
  );
}
