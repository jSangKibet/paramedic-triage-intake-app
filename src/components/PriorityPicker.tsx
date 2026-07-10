import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PriorityColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import type { PriorityLevel } from '@/types/triage';

interface PriorityPickerProps {
  value: PriorityLevel | null;
  onChange: (priority: PriorityLevel) => void;
}

const priorities: PriorityLevel[] = [1, 2, 3, 4, 5];

export function PriorityPicker({ value, onChange }: PriorityPickerProps) {
  return (
    <View style={styles.container}>
      {priorities.map((level) => (
        <PriorityChip
          key={level}
          level={level}
          selected={value === level}
          onPress={() => onChange(level)}
        />
      ))}
    </View>
  );
}

function PriorityChip({
  level,
  selected,
  onPress,
}: {
  level: PriorityLevel;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = PriorityColors[level];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.background : 'transparent',
          borderColor: colors.border,
          borderWidth: selected ? 2 : 1,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.95 : selected ? 1.02 : 1 }],
        },
      ]}
    >
      <ThemedText
        style={[
          styles.chipNumber,
          { color: selected ? colors.text : colors.border },
        ]}
      >
        {level}
      </ThemedText>
      <ThemedText
        style={[
          styles.chipLabel,
          { color: selected ? colors.text : colors.border },
        ]}
      >
        {colors.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    borderRadius: 8,
    minHeight: 56,
  },
  chipNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  chipLabel: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
