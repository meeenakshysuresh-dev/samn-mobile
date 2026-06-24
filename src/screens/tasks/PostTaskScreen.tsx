import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, CommonHeader } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useTaskUserContext } from '../../hooks/useTaskUserContext';
import type { CreateStackParamList } from '../../navigation/RootNavigator.types';
import { exitCreateStackScreen, finishCreateTaskFlow } from '../../navigation/taskNavigation';
import { createTask } from '../../services/task.service';
import type { TaskCategory, TaskPriority } from '../../types/task.types';
import { showErrorAlert } from '../../utils/errorLogger';
import { validateTaskInput } from '../../utils/taskWorkflow';
import { TaskFormFields, type TaskFormFieldErrors } from './components/TaskFormFields';
import { TaskFormLayout } from './components/TaskFormLayout';
import { taskFormStyles } from './taskFormStyles';

type Nav = NativeStackNavigationProp<CreateStackParamList, 'PostTask'>;

export const PostTaskScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { userName } = useTaskUserContext();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [errors, setErrors] = useState<TaskFormFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

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

    if (!user?.uid) {
      Alert.alert('Sign in required', 'You must be signed in to post a task.');
      return;
    }

    setSubmitting(true);
    try {
      const task = await createTask(input, user.uid, userName);
      Alert.alert('Task Posted', `"${task.title}" is now open for workers nearby.`, [
        { text: 'OK', onPress: () => finishCreateTaskFlow(navigation) },
      ]);
    } catch (error) {
      showErrorAlert('Error', error, 'PostTaskScreen', { userId: user.uid });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TaskFormLayout
      header={
        <CommonHeader
          title="Post a Task"
          showBackButton
          onBack={() => exitCreateStackScreen(navigation)}
          safeArea={false}
        />
      }
    >
      <TaskFormFields
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
        text={submitting ? 'Posting...' : 'Post Task'}
        icon={submitting ? undefined : 'plus'}
        preset="primary"
        style={taskFormStyles.submit}
        onPress={() => void handleSubmit()}
        disabled={submitting}
      />
    </TaskFormLayout>
  );
};
