import { StyleSheet } from 'react-native';

import { normalize } from '../../components/AppText/sizes';
import { fontFamily, spacing } from '../../theme/tokens';

export const taskFormLayout = {
  horizontalPadding: spacing.xl,
  fieldGap: spacing.lg,
  inputRadius: 10,
  inputHeight: 52,
  textAreaMinHeight: 120,
} as const;

export const taskFormStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: taskFormLayout.horizontalPadding,
    paddingTop: spacing.xl,
  },
  intro: {
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: taskFormLayout.fieldGap,
  },
  descriptionField: {
    marginBottom: spacing.xxl+30,
  },
  locationField: {
    marginTop: spacing.xxl,
  },
  inputWrapper: {
    borderRadius: taskFormLayout.inputRadius,
    minHeight: taskFormLayout.inputHeight,
  },
  textAreaWrapper: {
    minHeight: taskFormLayout.textAreaMinHeight,
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
    overflow: 'hidden',
  },
  inputText: {
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
    lineHeight: normalize(22.4),
  },
  textAreaText: {
    minHeight: taskFormLayout.textAreaMinHeight - 24,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  submit: {
    marginTop: spacing.md,
  },
});
