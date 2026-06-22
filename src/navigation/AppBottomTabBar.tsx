import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '../components/AppIcon';
import { AppText } from '../components/AppText';
import { useAuth } from '../hooks/useAuth';
import { useChatUnreadCount } from '../hooks/useChats';
import { useThemeStore } from '../theme/useThemeStore';
import { getTabBarBottomPadding } from './tabBarLayout';
import { tabBarStyles } from './tabBarStyles';

type TabKey = 'CreateStack' | 'ChatStack' | 'HomeStack' | 'ProfileStack' | 'SettingsStack';

type AppBottomTabBarProps = BottomTabBarProps & {
  onHeightChange?: (height: number) => void;
};

export const AppBottomTabBar: React.FC<AppBottomTabBarProps> = ({
  state,
  navigation,
  onHeightChange,
}) => {
  const theme = useThemeStore(s => s.theme);
  const styles = tabBarStyles(theme);
  const insets = useSafeAreaInsets();
  const bottomPadding = getTabBarBottomPadding(insets);
  const { user } = useAuth();
  const chatUnreadCount = useChatUnreadCount(user?.uid ?? 'guest-user');

  const activeRoute = state.routes[state.index]?.name as TabKey;
  const inactive = theme.tabBarItemInactive;
  const active = theme.tabBarItemActive;
  const lastReportedHeightRef = useRef(0);

  const navigateTo = (routeName: TabKey) => {
    const selected = activeRoute === routeName;
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes.find(route => route.name === routeName)?.key ?? '',
      canPreventDefault: true,
    });
    if (!selected && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const renderTab = (
    key: string,
    label: string,
    iconActive: string,
    iconInactive: string,
    selected: boolean,
    onPress?: () => void,
    disabled = false,
    badgeCount = 0,
  ) => (
    <TouchableOpacity
      key={key}
      style={[styles.tabBarItem, disabled && styles.tabBarItemDisabled]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={badgeCount > 0 ? `${label}, ${badgeCount} unread messages` : label}
    >
      <View style={styles.tabBarItemInner}>
        <View style={styles.tabBarIconWrap}>
          <AppIcon
            name={selected ? iconActive : iconInactive}
            color={selected ? active : inactive}
            width={24}
            height={24}
          />
          {badgeCount > 0 ? (
            <View style={[styles.tabBarBadge, { backgroundColor: theme.error }]}>
              <AppText style={styles.tabBarBadgeText}>
                {badgeCount > 9 ? '9+' : badgeCount}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText
          style={[styles.tabBarLabel, selected ? styles.tabBarLabelActive : styles.tabBarLabelInactive]}
        >
          {label}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.tabBar, { paddingBottom: bottomPadding }]}
      onLayout={event => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && height !== lastReportedHeightRef.current) {
          lastReportedHeightRef.current = height;
          onHeightChange?.(height);
        }
      }}
    >
      <View style={styles.tabBarRow}>
        <View style={styles.tabBarLeftGroup}>
          {renderTab(
            'task',
            'Task',
            'tabTaskActive',
            'tabTaskInactive',
            activeRoute === 'CreateStack',
            () => navigateTo('CreateStack'),
          )}
          {renderTab(
            'chat',
            'Chat',
            'tabChatActive',
            'tabChatInactive',
            activeRoute === 'ChatStack',
            () => navigateTo('ChatStack'),
            false,
            chatUnreadCount,
          )}
        </View>

        <View style={styles.tabBarRightGroup}>
          {renderTab(
            'profile',
            'Profile',
            'tabProfileActive',
            'tabProfileInactive',
            activeRoute === 'ProfileStack',
            () => navigateTo('ProfileStack'),
          )}
          {renderTab(
            'settings',
            'Settings',
            'tabSettingsActive',
            'tabSettingsInactive',
            activeRoute === 'SettingsStack',
            () => navigateTo('SettingsStack'),
          )}
        </View>

        <View style={styles.tabBarScanWrap} pointerEvents="box-none">
          <TouchableOpacity
            onPress={() => navigateTo('HomeStack')}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Home"
            accessibilityState={{ selected: activeRoute === 'HomeStack' }}
          >
            <View style={styles.tabBarScanRing}>
              <LinearGradient
                colors={[...theme.gradientScanFab]}
                locations={[0.3, 1]}
                start={{ x: 0, y: 0.6 }}
                end={{ x: 1, y: 0.3 }}
                style={styles.tabBarScanButton}
              >
                <AppIcon
                  name={activeRoute === 'HomeStack' ? 'tabHomeActive' : 'tabHomeInactive'}
                  color={theme.textInverse}
                  width={24}
                  height={24}
                />
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
