import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AppView, KeyboardAvoiding } from '../../../components';
import { useTabBarInset, TAB_BAR_DEFAULT_INSET } from '../../../navigation/tabBarLayout';
import { useAppTheme } from '../../../theme/useAppTheme';
import { spacing } from '../../../theme/tokens';
import { taskFormStyles } from '../taskFormStyles';

type TaskFormLayoutProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export const TaskFormLayout = ({ header, children }: TaskFormLayoutProps) => {
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      {header}
      <KeyboardAvoiding extraOffset={spacing.lg} style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            taskFormStyles.scrollContent,
            { paddingBottom: Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET) + spacing.xxl },
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoiding>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});
