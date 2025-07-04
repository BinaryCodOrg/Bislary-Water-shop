// src/electron/db/index.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create and export DB instance
const db = new Database(path.join(__dirname, "../../../waterData.db"));
export default db;
