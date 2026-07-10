import type { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS triages (
        id TEXT PRIMARY KEY NOT NULL,
        patient_name TEXT NOT NULL,
        condition_description TEXT NOT NULL,
        priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 5),
        status TEXT NOT NULL DEFAULT 'Pending',
        created_at INTEGER NOT NULL,
        synced INTEGER NOT NULL DEFAULT 0
      );
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
