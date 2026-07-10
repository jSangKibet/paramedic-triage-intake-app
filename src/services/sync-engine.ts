import type { SQLiteDatabase } from 'expo-sqlite';

import { getPendingTriages, markSynced } from '@/database/triage-repository';
import type { Triage } from '@/types/triage';

export interface SyncResult {
  synced: number;
  failed: number;
  errors: string[];
}

export type SubmitFn = (triage: Triage) => Promise<{ id: string; status: string }>;

export async function processSyncQueue(
  db: SQLiteDatabase,
  submitFn: SubmitFn
): Promise<SyncResult> {
  const pending = await getPendingTriages(db);
  let synced = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const triage of pending) {
    try {
      await submitFn(triage);
      await markSynced(db, triage.id);
      synced++;
    } catch (error) {
      failed++;
      errors.push(
        `Failed to sync triage ${triage.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return { synced, failed, errors };
}
