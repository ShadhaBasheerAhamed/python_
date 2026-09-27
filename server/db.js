import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database.sqlite');

let db = null;

export async function getDb() {
  if (db) return db;

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await initTables(db);
  return db;
}

async function initTables(dbInstance) {
  // Students Table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      grade TEXT NOT NULL,
      section TEXT NOT NULL,
      profile_key TEXT UNIQUE NOT NULL,
      current_level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      coins INTEGER DEFAULT 0,
      stars INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 1,
      last_activity_date TEXT,
      focus_interruptions INTEGER DEFAULT 0,
      badges_json TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Progress Table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      level_id INTEGER NOT NULL,
      topic TEXT NOT NULL,
      status TEXT DEFAULT 'locked',
      stars INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      completed_at DATETIME,
      UNIQUE(student_id, level_id),
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);

  // Activity Attempts Table (For adaptive learning analytics)
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      activity_id TEXT NOT NULL,
      level_id INTEGER NOT NULL,
      topic TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      time_taken INTEGER DEFAULT 0,
      attempt_number INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);

  // Badges Earned Table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      badge_key TEXT NOT NULL,
      badge_name TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, badge_key),
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);

  // Daily Challenge Logs Table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS daily_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      challenge_date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      UNIQUE(student_id, challenge_date),
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);
}

export default { getDb };
