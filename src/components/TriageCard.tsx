import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PriorityColors, SyncColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import type { Triage } from '@/types/triage';

interface TriageCardProps {
  triage: Triage;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function TriageCard({ triage }: TriageCardProps) {
  const colors = PriorityColors[triage.priority];
  const isSynced = triage.synced === 'synced';

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.patientName}>
          {triage.patientName}
        </ThemedText>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: colors.background },
          ]}
        >
          <ThemedText style={[styles.priorityText, { color: colors.text }]}>
            P{triage.priority}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="small" style={styles.condition}>
        {triage.conditionDescription}
      </ThemedText>

      <View style={styles.footer}>
        <ThemedText type="small" style={styles.time}>
          {formatTimeAgo(triage.createdAt)}
        </ThemedText>

        <View style={styles.syncStatus}>
          <View
            style={[
              styles.syncDot,
              {
                backgroundColor: isSynced
                  ? SyncColors.synced
                  : SyncColors.pending,
              },
            ]}
          />
          <ThemedText
            type="small"
            style={{
              color: isSynced ? SyncColors.synced : SyncColors.pending,
            }}
          >
            {isSynced ? 'Synced' : 'Pending sync'}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 4,
    marginLeft: Spacing.two,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  condition: {
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  time: {
    opacity: 0.5,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
