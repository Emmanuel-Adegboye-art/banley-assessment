import Dexie from "dexie";
import dexieMongoify from "dexie-mongoify";
import dexieRelationships from "dexie-relationships";

const db = new Dexie("TipManagerDB", {
  addons: [dexieMongoify, dexieRelationships],
});

export default db;
