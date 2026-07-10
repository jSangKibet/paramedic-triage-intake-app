import type { PriorityLevel } from '@/types/triage';

interface PriorityColor {
  background: string;
  text: string;
  border: string;
  label: string;
}

export const PriorityColors: Record<PriorityLevel, PriorityColor> = {
  1: {
    background: '#DC2626',
    text: '#FFFFFF',
    border: '#B91C1C',
    label: 'CRITICAL',
  },
  2: {
    background: '#EA580C',
    text: '#FFFFFF',
    border: '#C2410C',
    label: 'URGENT',
  },
  3: {
    background: '#D97706',
    text: '#FFFFFF',
    border: '#B45309',
    label: 'HIGH',
  },
  4: {
    background: '#2563EB',
    text: '#FFFFFF',
    border: '#1D4ED8',
    label: 'MODERATE',
  },
  5: {
    background: '#16A34A',
    text: '#FFFFFF',
    border: '#15803D',
    label: 'LOW',
  },
};

export const SyncColors = {
  synced: '#16A34A',
  pending: '#D97706',
  offline: '#DC2626',
  online: '#16A34A',
  syncing: '#D97706',
} as const;
