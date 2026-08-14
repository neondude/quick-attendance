import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "@/db";

export function useTags() {
  const tags = useObservable(
    liveQuery(() => db.tags.orderBy("name").toArray()),
    { initialValue: [] }
  );

  async function addTag(tagData) {
    return db.tags.add(tagData);
  }

  async function updateTag(id, changes) {
    return db.tags.update(id, changes);
  }

  async function deleteTag(id) {
    return db.tags.delete(id);
  }

  async function getTag(id) {
    return db.tags.get(id);
  }

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTag,
  };
}