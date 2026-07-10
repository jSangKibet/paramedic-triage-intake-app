export type PriorityLevel = 1 | 2 | 3 | 4 | 5;

export type TriageStatus = 'Pending' | 'In-Transit';

export type SyncStatus = 'pending' | 'synced';

export interface Triage {
  id: string;
  patientName: string;
  conditionDescription: string;
  priority: PriorityLevel;
  status: TriageStatus;
  createdAt: number;
  synced: SyncStatus;
}

export interface TriageFormData {
  patientName: string;
  conditionDescription: string;
  priority: PriorityLevel | null;
  status: TriageStatus;
}

export interface MockApiResponse {
  id: string;
  status: 'created';
}
