import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SyncColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';

export function SyncIndicator() {
  const isOnline = useAppSelector((state) => state.connectivity.isOnline);
  const isSyncing = useAppSelector((state) => state.triage.isSyncing);
  const syncQueueCount = useAppSelector((state) => state.triage.syncQueue.length);

  if (isSyncing) {
    return (
      <View style={styles.container}>
        <View style={[styles.dot, { backgroundColor: SyncColors.syncing }]} />
        <ThemedText style={[styles.label, { color: SyncColors.syncing }]}>
          Syncing...
        </ThemedText>
      </View>
    );
  }

  if (!isOnline) {
    return (
      <View style={styles.container}>
        <View style={[styles.dot, { backgroundColor: SyncColors.offline }]} />
        <ThemedText style={[styles.label, { color: SyncColors.offline }]}>
          Offline {syncQueueCount > 0 ? `(${syncQueueCount} pending)` : ''}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: SyncColors.online }]} />
      <ThemedText style={[styles.label, { color: SyncColors.online }]}>
        Online {syncQueueCount > 0 ? `(${syncQueueCount} pending)` : ''}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
