import React from 'react';
import {
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useIsRTL } from '../../hooks/useIsRTL';
import { header as headerTokens } from '../../theme/tokens';
import { useThemeStore } from '../../theme/useThemeStore';
import { AppIcon } from '../AppIcon';
import { AppText } from '../AppText';
import { AppView } from '../AppView';
import { createAppHeaderStyles } from './styles';
import type { AppHeaderProps } from './types';

const HeaderIconButton = ({
  icon,
  onPress,
  color,
  accessibilityLabel,
  pillStyle,
}: {
  icon: string;
  onPress?: () => void;
  color?: string;
  accessibilityLabel?: string;
  pillStyle?: object;
}) => (
  <TouchableOpacity
    style={pillStyle}
    onPress={onPress}
    disabled={!onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    accessibilityLabel={accessibilityLabel}
  >
    <AppIcon name={icon} size="md" color={color} />
  </TouchableOpacity>
);

type GradientHeaderProps = {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  onSearch?: () => void;
  onScan?: () => void;
  onEdit?: () => void;
  onMore?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  rightBadgeCount?: number;
  rightContent?: React.ReactNode;
  greetingTitle?: boolean;
  safeArea?: boolean;
};

export const StandardHeader: React.FC<GradientHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  onSearch,
  onScan,
  onEdit,
  onMore,
  rightIcon,
  onRightPress,
  rightBadgeCount = 0,
  rightContent,
  greetingTitle = false,
  safeArea = true,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useThemeStore(state => state.theme);
  const isRTL = useIsRTL();
  const styles = createAppHeaderStyles(theme, isRTL);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const topPadding = Math.max(
    insets.top,
    safeArea ? headerTokens.minTopInset : headerTokens.dashboardTopPadding,
  );
  const gradColors =
    Array.isArray(theme.gradientHeader) && theme.gradientHeader.length > 0
      ? [...theme.gradientHeader]
      : [theme.primaryDark, theme.primary];

  return (
    <LinearGradient colors={gradColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientHeader}>
      <AppView style={[styles.gradientHeaderContent, { paddingTop: topPadding }]}>
        <AppView style={[styles.gsHeaderRow, { marginBottom: 0 }]}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.gsBackBtnPill}
              onPress={handleBack}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityLabel="Go back"
            >
              <AppIcon name="chevronLeft" width={headerTokens.iconSize} height={headerTokens.iconSize} color={theme.headerText} rtlFlip={isRTL} />
            </TouchableOpacity>
          ) : (
            <AppView style={styles.gsBackBtnPill} />
          )}

          <AppView
            style={[
              styles.gsTitleWrapper,
              {
                alignItems: isRTL ? 'flex-end' : 'flex-start',
                marginLeft: isRTL ? 0 : 16,
                marginRight: isRTL ? 16 : 0,
              },
            ]}
          >
            {title ? (
              <AppText
                preset={greetingTitle ? 'headerGreeting' : 'headerTitle'}
                style={[
                  greetingTitle ? styles.greeting : styles.gsHeaderTitle,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {title}
              </AppText>
            ) : null}
            {subtitle ? (
              <AppText
                preset="headerSubtitle"
                style={[
                  styles.subtitleText,
                  greetingTitle ? styles.subGreeting : null,
                  {
                    marginTop: 2,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </AppText>
            ) : null}
          </AppView>

          <AppView style={styles.actions}>
            {rightContent}
            {rightIcon && onRightPress ? (
              <View style={{ position: 'relative' }}>
                <HeaderIconButton
                  icon={rightIcon}
                  onPress={onRightPress}
                  color={theme.headerText}
                  accessibilityLabel={rightIcon === 'bell' ? 'Notifications' : 'Edit profile'}
                  pillStyle={styles.gsBackBtnPill}
                />
                {rightBadgeCount > 0 ? (
                  <View style={[styles.headerBadge, { backgroundColor: theme.error }]}>
                    <AppText preset="caption" weight="bold" style={{ color: theme.headerText, fontSize: 10 }}>
                      {rightBadgeCount > 9 ? '9+' : rightBadgeCount}
                    </AppText>
                  </View>
                ) : null}
              </View>
            ) : null}
            {onEdit ? (
              <HeaderIconButton
                icon="edit"
                onPress={onEdit}
                color={theme.headerText}
                accessibilityLabel="Edit"
                pillStyle={styles.gsBackBtnPill}
              />
            ) : null}
            {onSearch ? (
              <HeaderIconButton icon="search" onPress={onSearch} color={theme.headerText} accessibilityLabel="Search" pillStyle={styles.gsBackBtnPill} />
            ) : null}
            {onScan ? (
              <HeaderIconButton icon="tabQrCode" onPress={onScan} color={theme.headerText} accessibilityLabel="Scan" pillStyle={styles.gsBackBtnPill} />
            ) : null}
            {onMore ? (
              <HeaderIconButton icon="menu" onPress={onMore} color={theme.headerText} accessibilityLabel="More options" pillStyle={styles.gsBackBtnPill} />
            ) : null}
          </AppView>
        </AppView>
      </AppView>
    </LinearGradient>
  );
};

export const CommonHeader = StandardHeader;

export type DashboardHeaderProps = {
  user?: { name?: string };
  onNotification?: () => void;
  onSettings?: () => void;
  safeArea?: boolean;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onNotification,
  onSettings,
  safeArea = false,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useThemeStore(state => state.theme);
  const isRTL = useIsRTL();
  const styles = createAppHeaderStyles(theme, isRTL);

  const topPadding = Math.max(
    insets.top,
    safeArea ? headerTokens.minTopInset : headerTokens.dashboardTopPadding,
  );
  const gradColors =
    Array.isArray(theme.gradientHeader) && theme.gradientHeader.length > 0
      ? [...theme.gradientHeader]
      : [theme.primaryDark, theme.primary];

  const displayName = user?.name?.trim() || 'Guest';
  const greetingText = `Hello, ${displayName}`;

  return (
    <LinearGradient
      colors={gradColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.gradientHeader, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}
    >
      <AppView style={[styles.gradientHeaderContent, { paddingTop: topPadding }]}>
        <AppView style={[styles.gsHeaderRow, { marginBottom: 0 }]}>
          <AppView
            style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: isRTL ? 0 : 16,
              marginRight: isRTL ? 16 : 0,
            }}
          >
            <AppText preset="headerGreeting" style={styles.greeting}>
              {greetingText}
            </AppText>
            <AppText preset="headerSubtitle" style={styles.subGreeting}>
              Welcome back
            </AppText>
          </AppView>

          <AppView style={[styles.actions, { gap: 8 }]}>
            {onNotification ? (
              <HeaderIconButton
                icon="bell"
                onPress={onNotification}
                color={theme.headerText}
                accessibilityLabel="Notifications"
                pillStyle={styles.gsBackBtnPill}
              />
            ) : null}
            {onSettings ? (
              <HeaderIconButton
                icon="settings"
                onPress={onSettings}
                color={theme.headerText}
                accessibilityLabel="Settings"
                pillStyle={styles.gsBackBtnPill}
              />
            ) : null}
          </AppView>
        </AppView>
      </AppView>
    </LinearGradient>
  );
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  preset = 'standard',
  title,
  tx,
  titlePreset = 'heading1',
  subtitle,
  subtitleTx,
  centerAligned,
  onLeftPress,
  leftIcon,
  showBack,
  onRightPress,
  rightIcon,
  leftContent,
  rightContent,
  children,
  transparent,
  safeArea,
  style,
  contentStyle,
  titleStyle,
}) => {
  const theme = useThemeStore(state => state.theme);
  const navigation = useNavigation();
  const isRTL = useIsRTL();
  const styles = createAppHeaderStyles(theme, isRTL);
  const isHome = preset === 'home';
  const isBack = preset === 'back';
  const _centerAligned = centerAligned ?? !(isHome || isBack);
  const _safeArea = safeArea ?? !(isHome || isBack);
  const _transparent = transparent ?? false;
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else {
      navigation.goBack();
    }
  };

  const headerTitle = tx ?? title;
  const headerSubtitle = subtitleTx ?? subtitle;

  const renderLeft = () => {
    if (leftContent) {
      return <AppView style={{ justifyContent: 'center' }}>{leftContent}</AppView>;
    }
    if (showBack || leftIcon) {
      return (
        <AppView style={styles.slot}>
          <Pressable
            onPress={handleBackPress}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <AppIcon
              name={leftIcon || 'chevronLeft'}
              width={24}
              height={24}
              color={theme.textPrimary}
              rtlFlip
            />
          </Pressable>
        </AppView>
      );
    }
    return _centerAligned ? <AppView style={styles.slot} /> : null;
  };

  const renderRight = () => {
    if (rightContent) {
      return <AppView style={{ justifyContent: 'center' }}>{rightContent}</AppView>;
    }
    if (!rightIcon) {
      return _centerAligned ? <AppView style={styles.slot} /> : null;
    }

    return (
      <AppView style={styles.slot}>
        {onRightPress ? (
          <Pressable
            onPress={onRightPress}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            hitSlop={10}
          >
            <AppIcon name={rightIcon} width={24} height={24} color={theme.textPrimary} rtlFlip />
          </Pressable>
        ) : (
          <AppView style={styles.actionButton}>
            <AppIcon name={rightIcon} width={24} height={24} color={theme.textPrimary} rtlFlip />
          </AppView>
        )}
      </AppView>
    );
  };

  const renderCenter = () => {
    if (children) {
      return (
        <AppView style={[styles.center, !_centerAligned && styles.centerStart]}>{children}</AppView>
      );
    }

    if (!headerTitle) {
      return <AppView style={styles.center} />;
    }

    return (
      <AppView style={[styles.center, !_centerAligned && styles.centerStart]}>
        <AppText preset={titlePreset} style={[styles.title, titleStyle]} numberOfLines={1}>
          {headerTitle}
        </AppText>
        {headerSubtitle ? (
          <AppText style={styles.subtitle} numberOfLines={1}>
            {headerSubtitle}
          </AppText>
        ) : null}
      </AppView>
    );
  };

  return (
    <AppView
      style={[
        styles.root,
        isHome && styles.presetHome,
        isBack && styles.presetBack,
        _transparent && styles.transparent,
        _safeArea && { paddingTop: insets?.top || 0 },
        style,
      ]}
    >
      <View style={[styles.navbar, isHome && styles.navbarHome, isBack && styles.navbarBack, contentStyle]}>
        {renderLeft()}
        {renderCenter()}
        {renderRight()}
      </View>
    </AppView>
  );
};
