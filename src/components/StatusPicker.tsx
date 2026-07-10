import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { TriageStatus } from '@/types/triage';

interface StatusPickerProps {
  value: TriageStatus;
  onChange: (status: TriageStatus) => void;
}

const options: { label: string; value: TriageStatus }[] = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In-Transit', value: 'In-Transit' },
];

export function StatusPicker({ value, onChange }: StatusPickerProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              selected && styles.segmentSelected,
              option.value === 'Pending' && styles.segmentLeft,
              option.value === 'In-Transit' && styles.segmentRight,
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                selected && styles.labelSelected,
              ]}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  segmentSelected: {
    backgroundColor: '#2563EB',
  },
  segmentLeft: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.15)',
  },
  segmentRight: {},
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});
