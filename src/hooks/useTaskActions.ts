import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { TASK_ACTION_LABELS } from '../constants/tasks';
import type { CreateStackParamList } from '../navigation/RootNavigator.types';
import {
  acceptTask as acceptTaskService,
  cancelAcceptance as cancelAcceptanceService,
  cancelTask as cancelTaskService,
  completeTask as completeTaskService,
  deleteTask as deleteTaskService,
  startTask as startTaskService,
} from '../services/task.service';
import type { Task, TaskActionKey } from '../types/task.types';
import { showErrorAlert } from '../utils/errorLogger';
import {
  canAcceptTask,
  canCancelAcceptance,
  canCancelTask,
  canCompleteTask,
  canDeleteTask,
  canEditTask,
  canStartTask,
  getTaskActions,
} from '../utils/taskWorkflow';

type Nav = NativeStackNavigationProp<CreateStackParamList>;

const ACTION_ICONS: Partial<Record<TaskActionKey | 'view', string>> = {
  view: undefined,
  accept: 'check',
  edit: 'edit',
  delete: 'trash',
  start: 'clock',
  complete: 'check',
  cancelTask: 'x',
  cancelAcceptance: 'x',
};

export const useTaskActions = (userId: string, userName: string) => {
  const navigation = useNavigation<Nav>();

  const runServiceAction = async (action: () => void | Promise<unknown>, actionName: string) => {
    try {
      await action();
    } catch (error) {
      showErrorAlert('Error', error, 'useTaskActions', { action: actionName, userId });
    }
  };

  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<unknown>,
    destructive = false,
  ) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: destructive ? 'Confirm' : 'OK',
        style: destructive ? 'destructive' : 'default',
        onPress: () => {
          void runServiceAction(async () => {
            await onConfirm();
          }, title);
        },
      },
    ]);
  };

  const runAction = (task: Task, action: TaskActionKey) => {
    switch (action) {
      case 'accept':
        if (!canAcceptTask(task, userId)) {
          Alert.alert('Unavailable', 'You cannot accept this task.');
          return;
        }
        confirm('Accept Task', `Accept "${task.title}"?`, () =>
          acceptTaskService(task.id, userId, userName),
        );
        break;
      case 'edit':
        if (!canEditTask(task, userId)) {
          return;
        }
        navigation.navigate('EditTask', { taskId: task.id });
        break;
      case 'delete':
        if (!canDeleteTask(task, userId)) {
          return;
        }
        confirm('Delete Task', `Remove "${task.title}"?`, () => deleteTaskService(task.id, userId), true);
        break;
      case 'start':
        if (!canStartTask(task, userId)) {
          return;
        }
        confirm('Start Task', `Mark "${task.title}" as in progress?`, () =>
          startTaskService(task.id, userId, userName),
        );
        break;
      case 'complete':
        if (!canCompleteTask(task, userId)) {
          return;
        }
        confirm('Complete Task', `Mark "${task.title}" as completed?`, () =>
          completeTaskService(task.id, userId, userName),
        );
        break;
      case 'cancelTask':
        if (!canCancelTask(task, userId)) {
          return;
        }
        confirm('Cancel Task', `Cancel "${task.title}"?`, () =>
          cancelTaskService(task.id, userId, userName),
        true);
        break;
      case 'cancelAcceptance':
        if (!canCancelAcceptance(task, userId)) {
          return;
        }
        confirm(
          'Cancel Acceptance',
          `Stop working on "${task.title}"? The task will become open again.`,
          () => cancelAcceptanceService(task.id, userId, userName),
          true,
        );
        break;
      default:
        break;
    }
  };

  const buildCardActions = (task: Task, includeView = true) => {
    const actionKeys = getTaskActions(task, userId);
    const cardActions = [];

    if (includeView) {
      cardActions.push({
        label: 'View Details',
        preset: 'primary' as const,
        onPress: () => navigation.navigate('TaskDetails', { taskId: task.id }),
      });
    }

    actionKeys.forEach(key => {
      const destructive = key === 'delete' || key === 'cancelTask' || key === 'cancelAcceptance';
      cardActions.push({
        label: TASK_ACTION_LABELS[key],
        icon: ACTION_ICONS[key],
        preset:
          key === 'accept' || key === 'complete' || key === 'start'
            ? ('primary' as const)
            : ('inline' as const),
        textColor: destructive ? '#B42318' : undefined,
        onPress: () => runAction(task, key),
      });
    });

    return cardActions;
  };

  const buildPrimaryCardAction = (task: Task, tab: 'available' | 'posted' | 'accepted') => {
    if (tab === 'available') {
      if (canAcceptTask(task, userId)) {
        return {
          label: 'Accept Task',
          icon: 'check' as const,
          preset: 'primary' as const,
          onPress: () => runAction(task, 'accept'),
        };
      }
      return {
        label: 'View Details',
        preset: 'primary' as const,
        onPress: () => navigation.navigate('TaskDetails', { taskId: task.id }),
      };
    }

    if (tab === 'posted') {
      return {
        label: 'View / Edit',
        icon: 'edit' as const,
        preset: 'primary' as const,
        onPress: () => {
          if (canEditTask(task, userId)) {
            navigation.navigate('EditTask', { taskId: task.id });
          } else {
            navigation.navigate('TaskDetails', { taskId: task.id });
          }
        },
      };
    }

    return {
      label: 'View',
      preset: 'primary' as const,
      onPress: () => navigation.navigate('TaskDetails', { taskId: task.id }),
    };
  };

  return {
    runAction,
    buildCardActions,
    buildPrimaryCardAction,
    viewDetails: (taskId: string) => navigation.navigate('TaskDetails', { taskId }),
    showTaskMenu: (task: Task) => {
      const actionKeys = getTaskActions(task, userId);
      Alert.alert(task.title, 'Choose an action', [
        {
          text: 'View Details',
          onPress: () => navigation.navigate('TaskDetails', { taskId: task.id }),
        },
        ...actionKeys.map(key => ({
          text: TASK_ACTION_LABELS[key],
          style:
            key === 'delete' || key === 'cancelTask' || key === 'cancelAcceptance'
              ? ('destructive' as const)
              : ('default' as const),
          onPress: () => runAction(task, key),
        })),
        { text: 'Close', style: 'cancel' as const },
      ]);
    },
  };
};
