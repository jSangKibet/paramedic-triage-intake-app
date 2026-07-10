import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TriageForm } from '@/components/TriageForm';
import { useSQLite } from '@/hooks/useSQLite';
import { BottomTabInset } from '@/constants/theme';

export default function HomeScreen() {
  const db = useSQLite();

  return (
    <SafeAreaView style={styles.container}>
      <TriageForm db={db} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: BottomTabInset,
  },
});
