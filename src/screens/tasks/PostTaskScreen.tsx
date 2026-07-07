import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, CommonHeader } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useTaskUserContext } from '../../hooks/useTaskUserContext';
import type { CreateStackParamList } from '../../navigation/RootNavigator.types';
import { exitCreateStackScreen, finishCreateTaskFlow } from '../../navigation/taskNavigation';
import {
  getCurrentLocation,
  LocationPermissionError,
  type LocationCoords,
  type ResolvedAddress,
} from '../../services/location.service';
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
  // Kept alongside the readable location for future backend API integration.
  const [locationCoords, setLocationCoords] = useState<LocationCoords | null>(null);
  const [locationAddress, setLocationAddress] = useState<ResolvedAddress | null>(null);
  const [locatingLocation, setLocatingLocation] = useState(false);

  const handleChangeLocation = useCallback((value: string) => {
    setLocation(value);
    // Manual edits invalidate the previously captured GPS coordinates.
    setLocationCoords(null);
    setLocationAddress(null);
  }, []);

  const handleUseCurrentLocation = useCallback(async () => {
    if (locatingLocation) {
      return;
    }

    setLocatingLocation(true);
    try {
      const { coords, label, address } = await getCurrentLocation();
      setLocation(label);
      setLocationCoords(coords);
      setLocationAddress(address ?? null);
      setErrors(prev => ({ ...prev, location: undefined }));
    } catch (error) {
      if (error instanceof LocationPermissionError) {
        Alert.alert(
          'Location Permission Needed',
          'Enable location access to use your current location, or enter it manually.',
        );
        return;
      }
      showErrorAlert('Location Error', error, 'PostTaskScreen');
    } finally {
      setLocatingLocation(false);
    }
  }, [locatingLocation]);

  const parsedBudgetValue = Number(budget);
  const isFormComplete =
    title.trim().length > 0 &&
    Boolean(category) &&
    description.trim().length > 0 &&
    location.trim().length > 0 &&
    budget.trim().length > 0 &&
    !Number.isNaN(parsedBudgetValue) &&
    parsedBudgetValue > 0 &&
    preferredDateTime.trim().length > 0;

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
      ...(locationCoords
        ? { latitude: locationCoords.latitude, longitude: locationCoords.longitude }
        : {}),
      ...(locationAddress
        ? {
            locationCity: locationAddress.city,
            locationState: locationAddress.state,
            locationCountry: locationAddress.country,
            locationPostalCode: locationAddress.postalCode,
          }
        : {}),
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
        onChangeLocation={handleChangeLocation}
        onChangeBudget={setBudget}
        onChangePreferredDateTime={setPreferredDateTime}
        onChangePriority={setPriority}
        onUseCurrentLocation={() => void handleUseCurrentLocation()}
        isLocatingLocation={locatingLocation}
      />

      <AppButton
        text={submitting ? 'Posting...' : 'Post Task'}
        icon={submitting ? undefined : 'plus'}
        preset="primary"
        style={[
          taskFormStyles.submit,
          (submitting || !isFormComplete) && taskFormStyles.submitDisabled,
        ]}
        onPress={() => void handleSubmit()}
        disabled={submitting || !isFormComplete}
      />
    </TaskFormLayout>
  );
};
