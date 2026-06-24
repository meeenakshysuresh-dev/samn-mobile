import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { AppButton, AppText, AppView, CommonHeader } from '../../components';
import { useTaskById } from '../../hooks/useTaskSelectors';
import { useTaskUserContext } from '../../hooks/useTaskUserContext';
import type { CreateStackParamList } from '../../navigation/RootNavigator.types';
import { exitCreateStackScreen, finishCreateTaskFlow } from '../../navigation/taskNavigation';
import { updateTask as updateTaskService } from '../../services/task.service';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/tokens';
import type { TaskCategory, TaskPriority } from '../../types/task.types';
import { showErrorAlert } from '../../utils/errorLogger';
import { canEditTask, validateTaskInput } from '../../utils/taskWorkflow';
import { TaskFormFields, type TaskFormFieldErrors } from './components/TaskFormFields';
import { TaskFormLayout } from './components/TaskFormLayout';
import { taskFormStyles } from './taskFormStyles';

type Nav = NativeStackNavigationProp<CreateStackParamList, 'EditTask'>;
type Route = RouteProp<CreateStackParamList, 'EditTask'>;

export const EditTaskScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { theme } = useAppTheme();
  const { userId } = useTaskUserContext();
  const task = useTaskById(route.params.taskId);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [errors, setErrors] = useState<TaskFormFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title);
    setCategory(task.category);
    setDescription(task.description);
    setLocation(task.location);
    setBudget(String(task.budget));
    setPreferredDateTime(task.preferredDateTime);
    setPriority(task.priority);
  }, [task]);

  if (!task) {
    return (
      <AppView style={[styles.centerScreen, { backgroundColor: theme.background }]}>
        <CommonHeader
          title="Edit Task"
          showBackButton
          onBack={() => exitCreateStackScreen(navigation)}
          safeArea={false}
        />
        <View style={styles.center}>
          <AppText preset="bodyLarge" style={{ color: theme.textSecondary }}>
            Task not found.
          </AppText>
        </View>
      </AppView>
    );
  }

  if (!canEditTask(task, userId)) {
    return (
      <AppView style={[styles.centerScreen, { backgroundColor: theme.background }]}>
        <CommonHeader
          title="Edit Task"
          showBackButton
          onBack={() => exitCreateStackScreen(navigation)}
          safeArea={false}
        />
        <View style={styles.center}>
          <AppText preset="bodyLarge" style={{ color: theme.textSecondary }}>
            Only open tasks can be edited.
          </AppText>
        </View>
      </AppView>
    );
  }

  const handleSubmit = async () => {
    const parsedBudget = Number(budget);
    const input = {
      title,
      category: category as TaskCategory,
      description,
      location,
      budget: parsedBudget,
      preferredDateTime,
      priority,
    };

    const validationErrors = validateTaskInput(input);
    if (!category) {
      validationErrors.category = 'Please select a category.';
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await updateTaskService(task.id, userId, input);
      Alert.alert('Task Updated', `"${title.trim()}" has been updated.`, [
        { text: 'OK', onPress: () => finishCreateTaskFlow(navigation) },
      ]);
    } catch (error) {
      showErrorAlert('Error', error, 'EditTaskScreen', { taskId: task.id, userId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TaskFormLayout
      header={
        <CommonHeader
          title="Edit Task"
          showBackButton
          onBack={() => exitCreateStackScreen(navigation)}
          safeArea={false}
        />
      }
    >
      <TaskFormFields
        showIntro={false}
        values={{ title, category, description, location, budget, preferredDateTime, priority }}
        errors={errors}
        onChangeTitle={setTitle}
        onChangeCategory={setCategory}
        onChangeDescription={setDescription}
        onChangeLocation={setLocation}
        onChangeBudget={setBudget}
        onChangePreferredDateTime={setPreferredDateTime}
        onChangePriority={setPriority}
      />

      <AppButton
        text={submitting ? 'Saving...' : 'Save Changes'}
        icon={submitting ? undefined : 'check'}
        preset="primary"
        style={taskFormStyles.submit}
        onPress={() => void handleSubmit()}
        disabled={submitting}
      />
    </TaskFormLayout>
  );
};

const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
});
