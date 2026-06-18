import React from 'react';
import { View } from 'react-native';

import { AppInput, AppRadioGroup, AppText } from '../../../components';
import { TASK_PRIORITY_OPTIONS } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { TaskCategory, TaskPriority } from '../../../types/task.types';
import { taskFormStyles } from '../taskFormStyles';
import { CategoryPicker } from './CategoryPicker';

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
        containerStyle={taskFormStyles.field}
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
        {...fieldProps}
      />

      <AppInput
        label="Budget / Price"
        placeholder="Enter amount in USD"
        value={values.budget}
        onChangeText={onChangeBudget}
        leftIcon="dollarSign"
        keyboardType="decimal-pad"
        error={errors.budget}
        returnKeyType="next"
        {...fieldProps}
      />

      <AppInput
        label="Preferred Date & Time"
        placeholder="e.g. Sat, 10:00 AM"
        value={values.preferredDateTime}
        onChangeText={onChangePreferredDateTime}
        leftIcon="calendar"
        error={errors.preferredDateTime}
        returnKeyType="done"
        {...fieldProps}
      />

      <View style={taskFormStyles.section}>
        <AppText preset="label" style={[taskFormStyles.sectionLabel, { color: theme.textSecondary }]}>
          Priority
        </AppText>
        <AppRadioGroup
          options={TASK_PRIORITY_OPTIONS}
          value={values.priority}
          onChange={value => onChangePriority(value as TaskPriority)}
        />
      </View>
    </>
  );
};
