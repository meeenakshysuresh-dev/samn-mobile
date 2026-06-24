import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppInput, AppRadioGroup, AppText } from '../../../components';
import { TASK_PRIORITY_OPTIONS } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { spacing } from '../../../theme/tokens';
import type { TaskCategory, TaskPriority } from '../../../types/task.types';
import {
  formatPreferredDateTime,
  mergeDateAndTime,
  resolvePreferredDateTime,
} from '../../../utils/preferredDateTime';
import { taskFormStyles } from '../taskFormStyles';
import { CategoryPicker } from './CategoryPicker';

type DateTimePickerComponent = React.ComponentType<{
  value: Date;
  mode: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner';
  onChange: (event: { type: string }, date?: Date) => void;
  themeVariant?: 'light' | 'dark';
}>;

const loadDateTimePicker = (): DateTimePickerComponent | null => {
  try {
    return require('@react-native-community/datetimepicker').default;
  } catch {
    return null;
  }
};

type TaskPreferredDateTimeFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fieldProps: {
    containerStyle: object;
    inputWrapperStyle: object;
    style: object;
    placeholderTextColor: string;
  };
};

const TaskPreferredDateTimeField = ({
  value,
  onChange,
  error,
  fieldProps,
}: TaskPreferredDateTimeFieldProps) => {
  const { theme, isDark } = useAppTheme();
  const [showIosPicker, setShowIosPicker] = useState(false);
  const selectedDate = useMemo(() => resolvePreferredDateTime(value), [value]);
  const DateTimePicker = useMemo(() => loadDateTimePicker(), []);

  const openPicker = useCallback(() => {
    if (Platform.OS === 'android') {
      const { DateTimePickerAndroid } = require('@react-native-community/datetimepicker');
      let pickedDate = selectedDate;

      DateTimePickerAndroid.open({
        value: pickedDate,
        mode: 'date',
        onChange: (event: { type: string }, date?: Date) => {
          if (event.type !== 'set' || !date) {
            return;
          }

          pickedDate = date;

          DateTimePickerAndroid.open({
            value: pickedDate,
            mode: 'time',
            is24Hour: false,
            onChange: (timeEvent: { type: string }, time?: Date) => {
              if (timeEvent.type === 'set' && time) {
                onChange(formatPreferredDateTime(mergeDateAndTime(pickedDate, time)));
              }
            },
          });
        },
      });
      return;
    }

    setShowIosPicker(current => !current);
  }, [onChange, selectedDate]);

  const handleIosChange = useCallback(
    (_event: { type: string }, nextDate?: Date) => {
      if (nextDate) {
        onChange(formatPreferredDateTime(nextDate));
      }
    },
    [onChange],
  );

  return (
    <View>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel="Choose preferred date and time"
      >
        <View pointerEvents="none">
          <AppInput
            label="Preferred Date & Time"
            placeholder="Tap to choose date and time"
            value={value}
            leftIcon="calendar"
            rightIcon="chevronDown"
            error={error}
            editable={false}
            showSoftInputOnFocus={false}
            {...fieldProps}
          />
        </View>
      </Pressable>

      {showIosPicker && Platform.OS === 'ios' && DateTimePicker ? (
        <View
          style={[
            styles.iosPickerWrap,
            { borderColor: theme.borderSubtle, backgroundColor: theme.card },
          ]}
        >
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            display="spinner"
            onChange={handleIosChange}
            themeVariant={isDark ? 'dark' : 'light'}
          />
        </View>
      ) : null}
    </View>
  );
};

export type TaskFormValues = {
  title: string;
  category: TaskCategory | '';
  description: string;
  location: string;
  budget: string;
  preferredDateTime: string;
  priority: TaskPriority;
};

export type TaskFormFieldErrors = Partial<Record<keyof TaskFormValues | 'category', string>>;

type TaskFormFieldsProps = {
  values: TaskFormValues;
  errors: TaskFormFieldErrors;
  onChangeTitle: (value: string) => void;
  onChangeCategory: (value: TaskCategory) => void;
  onChangeDescription: (value: string) => void;
  onChangeLocation: (value: string) => void;
  onChangeBudget: (value: string) => void;
  onChangePreferredDateTime: (value: string) => void;
  onChangePriority: (value: TaskPriority) => void;
  showIntro?: boolean;
};

export const TaskFormFields = ({
  values,
  errors,
  onChangeTitle,
  onChangeCategory,
  onChangeDescription,
  onChangeLocation,
  onChangeBudget,
  onChangePreferredDateTime,
  onChangePriority,
  showIntro = true,
}: TaskFormFieldsProps) => {
  const { theme } = useAppTheme();

  const fieldProps = {
    containerStyle: taskFormStyles.field,
    inputWrapperStyle: taskFormStyles.inputWrapper,
    style: taskFormStyles.inputText,
    placeholderTextColor: theme.textSecondary,
  };

  return (
    <>
      {showIntro ? (
        <AppText preset="bodyLarge" style={[taskFormStyles.intro, { color: theme.textSecondary }]}>
          Share what you need help with and connect with people nearby.
        </AppText>
      ) : null}

      <AppInput
        label="Task Title"
        placeholder="e.g. Apartment Deep Cleaning"
        value={values.title}
        onChangeText={onChangeTitle}
        error={errors.title}
        autoCapitalize="sentences"
        returnKeyType="next"
        {...fieldProps}
      />

      <CategoryPicker
        value={values.category}
        onChange={onChangeCategory}
        error={errors.category}
      />

      <AppInput
        label="Description"
        placeholder="Describe the task, requirements, and any special instructions..."
        value={values.description}
        onChangeText={onChangeDescription}
        error={errors.description}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        inputWrapperStyle={[taskFormStyles.inputWrapper, taskFormStyles.textAreaWrapper]}
        style={[taskFormStyles.inputText, taskFormStyles.textAreaText]}
        containerStyle={[taskFormStyles.field, taskFormStyles.descriptionField]}
        placeholderTextColor={theme.textSecondary}
      />

      <AppInput
        label="Location"
        placeholder="Neighborhood, address, or landmark"
        value={values.location}
        onChangeText={onChangeLocation}
        leftIcon="mapPin"
        error={errors.location}
        autoCapitalize="words"
        returnKeyType="next"
        containerStyle={[taskFormStyles.field, taskFormStyles.locationField]}
        inputWrapperStyle={taskFormStyles.inputWrapper}
        style={taskFormStyles.inputText}
        placeholderTextColor={theme.textSecondary}
      />

      <AppInput
        label="Budget / Price"
        placeholder="Enter amount in INR"
        value={values.budget}
        onChangeText={onChangeBudget}
        leftIcon="currencyInr"
        keyboardType="decimal-pad"
        error={errors.budget}
        returnKeyType="next"
        {...fieldProps}
      />

      <TaskPreferredDateTimeField
        value={values.preferredDateTime}
        onChange={onChangePreferredDateTime}
        error={errors.preferredDateTime}
        fieldProps={fieldProps}
      />

      <View style={taskFormStyles.section}>
        <AppText preset="label" style={[taskFormStyles.sectionLabel, { color: theme.textSecondary }]}>
          Priority
        </AppText>
        <AppRadioGroup
          options={TASK_PRIORITY_OPTIONS}
          value={values.priority}
          onChange={priority => onChangePriority(priority as TaskPriority)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  iosPickerWrap: {
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
