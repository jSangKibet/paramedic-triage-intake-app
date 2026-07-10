import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { PriorityPicker } from '@/components/PriorityPicker';
import { StatusPicker } from '@/components/StatusPicker';
import { SyncIndicator } from '@/components/SyncIndicator';
import { ThemedText } from '@/components/themed-text';
import { PriorityColors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import { useAppDispatch } from '@/store/hooks';
import { submitTriageRecord } from '@/store/triageSlice';
import type { PriorityLevel, TriageFormData, TriageStatus } from '@/types/triage';

interface TriageFormProps {
  db: any;
}

export function TriageForm({ db }: TriageFormProps) {
  const dispatch = useAppDispatch();
  const [patientName, setPatientName] = useState('');
  const [conditionDescription, setConditionDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel | null>(null);
  const [status, setStatus] = useState<TriageStatus>('Pending');
  const [errors, setErrors] = useState<{ patientName?: string; condition?: string; priority?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: typeof errors = {};

    if (!patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    if (!conditionDescription.trim()) {
      newErrors.condition = 'Condition is required';
    }
    if (priority === null) {
      newErrors.priority = 'Priority must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);

    const formData: TriageFormData = {
      patientName: patientName.trim(),
      conditionDescription: conditionDescription.trim(),
      priority: priority as PriorityLevel,
      status,
    };

    try {
      await dispatch(submitTriageRecord({ formData, db })).unwrap();
      Alert.alert('Saved', 'Triage record saved successfully.');
      setPatientName('');
      setConditionDescription('');
      setPriority(null);
      setStatus('Pending');
      setErrors({});
    } catch {
      Alert.alert('Error', 'Failed to save triage record.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ThemedText type="subtitle">Triage Intake</ThemedText>
          <SyncIndicator />
        </View>

        <View style={styles.field}>
          <ThemedText type="smallBold" style={styles.label}>
            Patient Name
          </ThemedText>
          <TextInput
            style={[styles.input, errors.patientName && styles.inputError]}
            value={patientName}
            onChangeText={(text) => {
              setPatientName(text);
              if (errors.patientName) setErrors((e) => ({ ...e, patientName: undefined }));
            }}
            placeholder="Enter patient name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            editable={!isSubmitting}
          />
          {errors.patientName && (
            <ThemedText style={styles.errorText}>{errors.patientName}</ThemedText>
          )}
        </View>

        <View style={styles.field}>
          <ThemedText type="smallBold" style={styles.label}>
            Condition
          </ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, errors.condition && styles.inputError]}
            value={conditionDescription}
            onChangeText={(text) => {
              setConditionDescription(text);
              if (errors.condition) setErrors((e) => ({ ...e, condition: undefined }));
            }}
            placeholder="Describe the patient's condition"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
          {errors.condition && (
            <ThemedText style={styles.errorText}>{errors.condition}</ThemedText>
          )}
        </View>

        <View style={styles.field}>
          <ThemedText type="smallBold" style={styles.label}>
            Priority Level
          </ThemedText>
          <PriorityPicker value={priority} onChange={(p) => {
            setPriority(p);
            if (errors.priority) setErrors((e) => ({ ...e, priority: undefined }));
          }} />
          {errors.priority && (
            <ThemedText style={styles.errorText}>{errors.priority}</ThemedText>
          )}
        </View>

        <View style={styles.field}>
          <ThemedText type="smallBold" style={styles.label}>
            Status
          </ThemedText>
          <StatusPicker value={status} onChange={setStatus} />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.submitButton,
            priority && PriorityColors[priority] && {
              backgroundColor: pressed
                ? PriorityColors[priority].border
                : PriorityColors[priority].background,
            },
            (!priority || isSubmitting) && styles.submitButtonDisabled,
          ]}
        >
          <ThemedText
            style={[
              styles.submitText,
              (!priority || isSubmitting) && styles.submitTextDisabled,
            ]}
          >
            {isSubmitting ? 'Saving...' : 'Submit Triage'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    marginBottom: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    minHeight: 48,
    color: '#000000',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  textArea: {
    minHeight: 80,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: Spacing.four,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginTop: Spacing.two,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  submitTextDisabled: {
    opacity: 0.7,
  },
});
