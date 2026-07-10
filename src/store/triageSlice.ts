import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SQLiteDatabase } from 'expo-sqlite';

import { getAllTriages, getPendingTriages, insertTriage, markSynced } from '@/database/triage-repository';
import { submitTriage } from '@/services/mock-api';
import type { Triage, TriageFormData, PriorityLevel } from '@/types/triage';

interface TriageState {
  records: Triage[];
  syncQueue: string[];
  isSyncing: boolean;
}

const initialState: TriageState = {
  records: [],
  syncQueue: [],
  isSyncing: false,
};

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const submitTriageRecord = createAsyncThunk(
  'triage/submitTriage',
  async (
    { formData, db }: { formData: TriageFormData; db: SQLiteDatabase },
    { dispatch, getState }
  ) => {
    const triage: Triage = {
      id: generateId(),
      patientName: formData.patientName,
      conditionDescription: formData.conditionDescription,
      priority: formData.priority as PriorityLevel,
      status: formData.status,
      createdAt: Date.now(),
      synced: 'pending',
    };

    await insertTriage(db, triage);
    dispatch(addTriage(triage));

    const state = getState() as { connectivity: { isOnline: boolean } };
    if (state.connectivity.isOnline) {
      try {
        await submitTriage(triage);
        await markSynced(db, triage.id);
        dispatch(markSyncedAction(triage.id));
      } catch {
        // Record saved locally, will sync later
      }
    }

    return triage;
  }
);

export const syncPendingTriages = createAsyncThunk(
  'triage/syncPending',
  async ({ db }: { db: SQLiteDatabase }, { dispatch }) => {
    const pending = await getPendingTriages(db);
    let syncedCount = 0;

    for (const triage of pending) {
      try {
        await submitTriage(triage);
        await markSynced(db, triage.id);
        dispatch(markSyncedAction(triage.id));
        syncedCount++;
      } catch {
        // Will retry on next sync trigger
      }
    }

    return syncedCount;
  }
);

export const loadTriages = createAsyncThunk(
  'triage/loadAll',
  async ({ db }: { db: SQLiteDatabase }) => {
    return await getAllTriages(db);
  }
);

const triageSlice = createSlice({
  name: 'triage',
  initialState,
  reducers: {
    addTriage(state, action: PayloadAction<Triage>) {
      state.records.unshift(action.payload);
      state.syncQueue.push(action.payload.id);
    },
    markSyncedAction(state, action: PayloadAction<string>) {
      const id = action.payload;
      const record = state.records.find((r) => r.id === id);
      if (record) {
        record.synced = 'synced';
      }
      state.syncQueue = state.syncQueue.filter((qid) => qid !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTriages.fulfilled, (state, action) => {
        state.records = action.payload;
        state.syncQueue = action.payload
          .filter((r) => r.synced === 'pending')
          .map((r) => r.id);
      })
      .addCase(syncPendingTriages.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncPendingTriages.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(syncPendingTriages.rejected, (state) => {
        state.isSyncing = false;
      });
  },
});

export const { addTriage, markSyncedAction } = triageSlice.actions;
export default triageSlice.reducer;
