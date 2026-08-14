import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
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

  return {
    classes,
    addClass,
    updateClass,
    deleteClass,
    getClass,
  };
}