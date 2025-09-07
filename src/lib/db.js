import Dexie from "dexie";

export const db = new Dexie("MyDatabase");

db.version(1).stores({
  chats: "id, data",
});
