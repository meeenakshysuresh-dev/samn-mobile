import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, spacing } from '../../../theme/tokens';

type EmptyTaskStateProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onCreatePress?: () => void;
};

export const EmptyTaskState = ({
  title = 'No tasks yet',
  description = 'Post your first task and connect with people nearby who can help.',
  buttonText = 'Create Your First Task',
  onCreatePress,
}: EmptyTaskStateProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary }]}>
        <AppIcon name="tabTaskActive" width={32} height={32} color={brand.primary} />
      </View>
      <AppText preset="heading2" style={{ color: theme.textPrimary, marginTop: spacing.lg, textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText preset="body" style={{ color: theme.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
        {description}
      </AppText>
      {onCreatePress ? (
        <AppButton
          text={buttonText}
          icon="plus"
          style={styles.button}
          onPress={onCreatePress}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
});
