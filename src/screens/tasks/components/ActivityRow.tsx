import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppCard, AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, spacing } from '../../../theme/tokens';
import type { ActivityItem } from '../../../types/task.types';
import type { IconName } from '../../../components/AppIcon/IconRegistry';

type ActivityRowProps = {
  item: ActivityItem;
};

export const ActivityRow = ({ item }: ActivityRowProps) => {
  const { theme } = useAppTheme();

  return (
    <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.surfaceSecondary }]}>
        <AppIcon name={item.icon as IconName} width={18} height={18} color={brand.primary} />
      </View>
      <View style={styles.content}>
        <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary }} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 2 }} numberOfLines={2}>
          {item.subtitle}
        </AppText>
        <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 4 }}>
          {item.timestamp}
        </AppText>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
});
