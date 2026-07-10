import type { SQLiteDatabase } from 'expo-sqlite';

import type { PriorityLevel, Triage, TriageStatus } from '@/types/triage';

interface TriageRow {
  id: string;
  patient_name: string;
  condition_description: string;
  priority: number;
  status: string;
  created_at: number;
  synced: number;
}

function rowToTriage(row: TriageRow): Triage {
  return {
    id: row.id,
    patientName: row.patient_name,
    conditionDescription: row.condition_description,
    priority: row.priority as PriorityLevel,
    status: row.status as TriageStatus,
    createdAt: row.created_at,
    synced: row.synced === 1 ? 'synced' : 'pending',
  };
}

export async function insertTriage(db: SQLiteDatabase, triage: Triage): Promise<void> {
  await db.runAsync(
    `INSERT INTO triages (id, patient_name, condition_description, priority, status, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    triage.id,
    triage.patientName,
    triage.conditionDescription,
    triage.priority,
    triage.status,
    triage.createdAt,
    triage.synced === 'synced' ? 1 : 0
  );
}

export async function getAllTriages(db: SQLiteDatabase): Promise<Triage[]> {
  const rows = await db.getAllAsync<TriageRow>(
    'SELECT * FROM triages ORDER BY created_at DESC'
  );
  return rows.map(rowToTriage);
}

export async function getPendingTriages(db: SQLiteDatabase): Promise<Triage[]> {
  const rows = await db.getAllAsync<TriageRow>(
    'SELECT * FROM triages WHERE synced = 0 ORDER BY created_at ASC'
  );
  return rows.map(rowToTriage);
}

export async function markSynced(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('UPDATE triages SET synced = 1 WHERE id = ?', id);
}

export async function deleteTriage(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM triages WHERE id = ?', id);
}
