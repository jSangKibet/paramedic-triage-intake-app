import { submitTriage } from '../services/mock-api';
import type { Triage } from '../types/triage';

function createTestTriage(): Triage {
  return {
    id: 'test_1',
    patientName: 'John Doe',
    conditionDescription: 'Chest pain',
    priority: 1,
    status: 'Pending',
    createdAt: Date.now(),
    synced: 'pending',
  };
}

describe('mock-api', () => {
  it('should return a response with id and status', async () => {
    const triage = createTestTriage();
    const response = await submitTriage(triage);

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('status', 'created');
    expect(typeof response.id).toBe('string');
    expect(response.id.startsWith('srv_')).toBe(true);
  });

  it('should take approximately 2 seconds to respond', async () => {
    const triage = createTestTriage();
    const start = Date.now();
    await submitTriage(triage);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(1800);
  });

  it('should sometimes fail (random network error)', async () => {
    const failures = [];
    for (let i = 0; i < 50; i++) {
      try {
        await submitTriage(createTestTriage());
      } catch {
        failures.push(true);
      }
    }

    expect(failures.length).toBeGreaterThan(0);
  }, 120000);
});
