import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SyncIndicator } from '@/components/SyncIndicator';
import { ThemedText } from '@/components/themed-text';
import { TriageCard } from '@/components/TriageCard';
import { useSQLite } from '@/hooks/useSQLite';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadTriages } from '@/store/triageSlice';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function HistoryScreen() {
  const db = useSQLite();
  const dispatch = useAppDispatch();
  const triages = useAppSelector((state) => state.triage.records);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadTriages({ db }));
  }, [dispatch, db]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(loadTriages({ db }));
    setRefreshing(false);
  }, [dispatch, db]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">History</ThemedText>
        <SyncIndicator />
      </View>

      <FlatList
        data={triages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TriageCard triage={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText type="small" style={styles.emptyText}>
              No triage records yet.
            </ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: BottomTabInset,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.six,
  },
  emptyText: {
    opacity: 0.5,
  },
});
