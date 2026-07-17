import { appSchemas } from "@/services/schema";
import Dexie from "dexie";

const db = new Dexie("TipManagerDB");
db.version(1).stores(appSchemas);

export default db;