import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import { taskSoftShadow } from '../taskUiStyles';

type EmptyTaskStateProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onCreatePress?: () => void;
};

export const EmptyTaskState = ({
  title = 'No Tasks Found',
  description = 'Post your first task and connect with people nearby who can help.',
  buttonText = 'Create Your First Task',
  onCreatePress,
}: EmptyTaskStateProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.illustration,
          taskSoftShadow(theme),
          {
            backgroundColor: theme.card,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary }]}>
          <AppIcon name="tabTaskActive" width={36} height={36} color={brand.primary} />
        </View>
        <View style={[styles.placeholderLine, { backgroundColor: theme.surfaceTertiary }]} />
        <View style={[styles.placeholderLineShort, { backgroundColor: theme.surfaceTertiary }]} />
      </View>

      <AppText preset="heading2" weight="bold" style={{ color: theme.textPrimary, marginTop: spacing.xl, textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText
        preset="body"
        style={{ color: theme.textSecondary, marginTop: spacing.sm, textAlign: 'center', lineHeight: 22, maxWidth: 280 }}
      >
        {description}
      </AppText>
      {onCreatePress ? (
        <AppButton text={buttonText} icon="plus" preset="primary" style={styles.button} onPress={onCreatePress} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  illustration: {
    width: '100%',
    maxWidth: 220,
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLine: {
    width: '70%',
    height: 8,
    borderRadius: 4,
    marginTop: spacing.lg,
  },
  placeholderLineShort: {
    width: '45%',
    height: 8,
    borderRadius: 4,
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
    borderRadius: 14,
  },
});
