import type { MockApiResponse, Triage } from '@/types/triage';

function generateMockId(): string {
  return `srv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function submitTriage(triage: Triage): Promise<MockApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (Math.random() < 0.15) {
    throw new Error('Network error: request timed out');
  }

  return {
    id: generateMockId(),
    status: 'created',
  };
}
