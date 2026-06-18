import { useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

type UseConfirmExitOnBackOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  enabled?: boolean;
};

export const useConfirmExitOnBack = ({
  title = 'Exit SAMN',
  message = 'Are you sure you want to exit the app?',
  confirmText = 'Exit',
  cancelText = 'Cancel',
  enabled = true,
}: UseConfirmExitOnBackOptions = {}) => {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        return;
      }

      const onBackPress = () => {
        Alert.alert(title, message, [
          { text: cancelText, style: 'cancel' },
          {
            text: confirmText,
            style: 'destructive',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [cancelText, confirmText, enabled, message, title]),
  );
};
