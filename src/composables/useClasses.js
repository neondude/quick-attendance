import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { unref } from "vue";
import { db } from "@/db";

export function useClasses() {
  const classes = useObservable(
    liveQuery(() => db.classes.orderBy("time").toArray()),
    { initialValue: [] }
  );

  async function addClass(classData) {
    return db.classes.add(classData);
  }

  async function updateClass(id, changes) {
    return db.classes.update(id, changes);
  }

  async function deleteClass(id) {
    return db.classes.delete(id);
  }

  async function getClass(id) {
    return db.classes.get(id);
  }

  function useClassById(classId) {
    return useObservable(
      liveQuery(async () => {
        const resolvedClassId = Number(unref(classId));

        if (!Number.isFinite(resolvedClassId)) {
          return null;
        }

        return (await db.classes.get(resolvedClassId)) || null;
      }),
      { initialValue: undefined }
    );
  }

  return {
    classes,
    useClassById,
    addClass,
    updateClass,
    deleteClass,
    getClass,
  };
}