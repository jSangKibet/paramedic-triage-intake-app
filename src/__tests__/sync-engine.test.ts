import { processSyncQueue } from '../services/sync-engine';
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

describe('sync-engine', () => {
  it('should return zero counts when submitFn is called with empty queue', async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue([]),
      runAsync: jest.fn(),
    };

    const submitFn = jest.fn();
    const result = await processSyncQueue(mockDb as any, submitFn);

    expect(result.synced).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.errors).toHaveLength(0);
    expect(submitFn).not.toHaveBeenCalled();
  });

  it('should sync all pending triages on success', async () => {
    const triages = [
      createTestTriage({ id: 't1' }),
      createTestTriage({ id: 't2' }),
    ];

    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(
        triages.map((t) => ({
          ...t,
          patient_name: t.patientName,
          condition_description: t.conditionDescription,
          created_at: t.createdAt,
          synced: 0,
        }))
      ),
      runAsync: jest.fn(),
    };

    const submitFn = jest.fn().mockResolvedValue({ id: 'srv_1', status: 'created' });
    const result = await processSyncQueue(mockDb as any, submitFn);

    expect(result.synced).toBe(2);
    expect(result.failed).toBe(0);
    expect(submitFn).toHaveBeenCalledTimes(2);
    expect(mockDb.runAsync).toHaveBeenCalledTimes(2);
  });

  it('should handle partial failures', async () => {
    const triages = [
      createTestTriage({ id: 't1' }),
      createTestTriage({ id: 't2' }),
      createTestTriage({ id: 't3' }),
    ];

    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(
        triages.map((t) => ({
          ...t,
          patient_name: t.patientName,
          condition_description: t.conditionDescription,
          created_at: t.createdAt,
          synced: 0,
        }))
      ),
      runAsync: jest.fn(),
    };

    let callCount = 0;
    const submitFn = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 2) {
        throw new Error('Network error');
      }
      return Promise.resolve({ id: `srv_${callCount}`, status: 'created' });
    });

    const result = await processSyncQueue(mockDb as any, submitFn);

    expect(result.synced).toBe(2);
    expect(result.failed).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('t2');
  });
});
