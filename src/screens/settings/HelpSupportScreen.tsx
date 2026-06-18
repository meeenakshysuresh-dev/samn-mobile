import React, { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppCard, AppIcon, AppLogo, AppText, AppView, CommonHeader } from '../../components';
import {
  APP_SHORT_NAME,
  APP_VERSION,
  FAQ_ITEMS,
  SUPPORT_EMAIL,
} from '../../constants/appInfo';
import { exitSettingsStackScreen } from '../../navigation/stackNavigation';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import type { SettingsStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { brand, spacing } from '../../theme/tokens';
import { SettingsMenuRow } from './SettingsMenuRow';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'HelpSupport'>;

type FaqItemProps = {
  question: string;
  answer: string;
  expanded: boolean;
  onToggle: () => void;
};

const FaqItem = ({ question, answer, expanded, onToggle }: FaqItemProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.faqItem, { borderBottomColor: theme.border }]}
    >
      <View style={styles.faqHeader}>
        <AppText preset="body" weight="semibold" style={[styles.faqQuestion, { color: theme.textPrimary }]}>
          {question}
        </AppText>
        <AppIcon
          name={expanded ? 'chevronUp' : 'chevronDown'}
          width={18}
          height={18}
          color={theme.textMuted}
        />
      </View>
      {expanded ? (
        <AppText preset="body" style={{ color: theme.textSecondary, marginTop: spacing.sm, lineHeight: 20 }}>
          {answer}
        </AppText>
      ) : null}
    </Pressable>
  );
};

export const HelpSupportScreen = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const openEmail = (subject: string) => {
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`);
  };

  const showPlaceholder = (title: string) => {
    Alert.alert(title, 'This feature will be available in a future update.');
  };

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader title="Help & Support" onBack={() => exitSettingsStackScreen(navigation)} safeArea={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 24 }]}
      >
        <View style={styles.logoSection}>
          <AppLogo size={88} />
          <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: spacing.sm }}>
            {APP_SHORT_NAME} Help Center
          </AppText>
        </View>

        <AppCard style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={[styles.groupTitle, { color: theme.textSecondary }]}>
            Frequently Asked Questions
          </AppText>
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              expanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(current => (current === index ? null : index))}
            />
          ))}
        </AppCard>

        <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={[styles.groupTitle, { color: theme.textSecondary }]}>
            Support
          </AppText>
          <SettingsMenuRow
            label="Contact Support"
            description="Get help from the SAMN team"
            icon="help"
            onPress={() => showPlaceholder('Contact Support')}
            showDivider
          />
          <SettingsMenuRow
            label="Email Support"
            description={SUPPORT_EMAIL}
            icon="mail"
            onPress={() => openEmail(`${APP_SHORT_NAME} Support Request`)}
            showDivider
          />
          <SettingsMenuRow
            label="Report a Problem"
            description="Tell us about a bug or issue"
            icon="alert"
            onPress={() => openEmail(`${APP_SHORT_NAME} Problem Report`)}
            showDivider={false}
          />
        </View>

        <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={[styles.groupTitle, { color: theme.textSecondary }]}>
            Legal
          </AppText>
          <SettingsMenuRow
            label="Privacy Policy"
            icon="shield"
            onPress={() => showPlaceholder('Privacy Policy')}
            showDivider
          />
          <SettingsMenuRow
            label="Terms & Conditions"
            icon="fileText"
            onPress={() => showPlaceholder('Terms & Conditions')}
            showDivider={false}
          />
        </View>

        <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <SettingsMenuRow
            label="Rate the App"
            description="Share your feedback on the app store"
            icon="star"
            onPress={() => showPlaceholder('Rate the App')}
            showDivider={false}
          />
        </View>

        <AppText preset="caption" style={[styles.version, { color: theme.textMuted }]}>
          App Version {APP_VERSION}
        </AppText>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  group: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  groupTitle: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
