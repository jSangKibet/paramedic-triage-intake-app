import { configureStore } from '@reduxjs/toolkit';

import triageReducer, {
  addTriage,
  markSyncedAction,
} from '../store/triageSlice';
import connectivityReducer, { setOnline } from '../store/connectivitySlice';
import type { Triage } from '../types/triage';

function createTestTriage(overrides: Partial<Triage> = {}): Triage {
  return {
    id: 'test_1',
    patientName: 'John Doe',
    conditionDescription: 'Chest pain',
    priority: 1,
    status: 'Pending',
    createdAt: Date.now(),
    synced: 'pending',
    ...overrides,
  };
}

function createTestStore() {
  return configureStore({
    reducer: {
      triage: triageReducer,
      connectivity: connectivityReducer,
    },
  });
}

describe('triageSlice', () => {
  it('should return the initial state', () => {
    const store = createTestStore();
    const state = store.getState().triage;
    expect(state.records).toEqual([]);
    expect(state.syncQueue).toEqual([]);
    expect(state.isSyncing).toBe(false);
  });

  it('should add a triage record', () => {
    const store = createTestStore();
    const triage = createTestTriage();

    store.dispatch(addTriage(triage));

    const state = store.getState().triage;
    expect(state.records).toHaveLength(1);
    expect(state.records[0].id).toBe('test_1');
    expect(state.syncQueue).toContain('test_1');
  });

  it('should mark a triage as synced', () => {
    const store = createTestStore();
    const triage = createTestTriage();

    store.dispatch(addTriage(triage));
    store.dispatch(markSyncedAction('test_1'));

    const state = store.getState().triage;
    expect(state.records[0].synced).toBe('synced');
    expect(state.syncQueue).not.toContain('test_1');
  });

  it('should add multiple triages and track sync queue', () => {
    const store = createTestStore();
    const t1 = createTestTriage({ id: 't1' });
    const t2 = createTestTriage({ id: 't2' });

    store.dispatch(addTriage(t1));
    store.dispatch(addTriage(t2));

    const state = store.getState().triage;
    expect(state.records).toHaveLength(2);
    expect(state.syncQueue).toHaveLength(2);

    store.dispatch(markSyncedAction('t1'));
    const updated = store.getState().triage;
    expect(updated.syncQueue).toHaveLength(1);
    expect(updated.syncQueue).toContain('t2');
  });

  it('should add new triage to the beginning of records', () => {
    const store = createTestStore();
    const t1 = createTestTriage({ id: 't1', patientName: 'First' });
    const t2 = createTestTriage({ id: 't2', patientName: 'Second' });

    store.dispatch(addTriage(t1));
    store.dispatch(addTriage(t2));

    const state = store.getState().triage;
    expect(state.records[0].patientName).toBe('Second');
    expect(state.records[1].patientName).toBe('First');
  });
});

describe('connectivitySlice', () => {
  it('should default to online', () => {
    const store = createTestStore();
    expect(store.getState().connectivity.isOnline).toBe(true);
  });

  it('should set online status', () => {
    const store = createTestStore();
    store.dispatch(setOnline(false));
    expect(store.getState().connectivity.isOnline).toBe(false);

    store.dispatch(setOnline(true));
    expect(store.getState().connectivity.isOnline).toBe(true);
  });
});
