import { StyleSheet } from 'react-native';

import { brand, fontFamily, spacing } from '../../theme/tokens';
import { normalize } from '../../components/AppText/sizes';

export const profileColors = {
  background: '#F0F7F5',
  inputFill: '#EDEDED',
  inputPlaceholder: '#9CA3AF',
  photoBorder: 'rgba(0, 95, 80, 0.15)',
};

export const profileLayout = {
  horizontalPadding: spacing.xxl,
  fieldGap: spacing.lg,
  inputRadius: 10,
  inputHeight: 52,
  photoWidth: 120,
  photoHeight: 150,
  photoRadius: 12,
};

export const profileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: profileColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: profileLayout.horizontalPadding,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  headerSide: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: brand.primary,
    fontFamily: fontFamily.bold,
    fontSize: normalize(18),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: profileLayout.horizontalPadding,
    paddingBottom: spacing.xxl * 2,
  },
  photoSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#D4EBE4',
    borderWidth: 1,
    borderColor: profileColors.photoBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  avatarInitials: {
    color: brand.primary,
    fontFamily: fontFamily.bold,
    fontSize: normalize(26),
    lineHeight: normalize(32),
    letterSpacing: normalize(1),
    textAlign: 'center',
    includeFontPadding: false,
  },
  photoFrame: {
    width: profileLayout.photoWidth,
    height: profileLayout.photoHeight,
    borderRadius: profileLayout.photoRadius,
    overflow: 'hidden',
    backgroundColor: profileColors.inputFill,
    borderWidth: 1,
    borderColor: profileColors.photoBorder,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEditButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoLink: {
    marginTop: spacing.md,
    color: brand.primary,
    fontFamily: fontFamily.semibold,
    fontSize: normalize(14),
  },
  fieldSpacing: {
    marginBottom: profileLayout.fieldGap,
  },
  fieldLabel: {
    color: brand.primary,
    fontFamily: fontFamily.semibold,
    fontSize: normalize(11),
    letterSpacing: normalize(0.8),
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginLeft: 2,
  },
  inputWrapper: {
    backgroundColor: profileColors.inputFill,
    borderWidth: 0,
    borderRadius: profileLayout.inputRadius,
    minHeight: profileLayout.inputHeight,
  },
  inputText: {
    fontSize: normalize(15),
    fontFamily: fontFamily.regular,
    color: '#111827',
  },
  textAreaWrapper: {
    backgroundColor: profileColors.inputFill,
    borderRadius: profileLayout.inputRadius,
    minHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: profileColors.inputFill,
    borderRadius: profileLayout.inputRadius,
    minHeight: profileLayout.inputHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: brand.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  skillChipText: {
    color: brand.primary,
    fontFamily: fontFamily.medium,
    fontSize: normalize(13),
  },
  addSkillButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillInput: {
    minWidth: 80,
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    color: '#111827',
    paddingVertical: 4,
  },
  saveButton: {
    marginTop: spacing.xl,
    borderRadius: profileLayout.inputRadius,
    minHeight: profileLayout.inputHeight,
  },
  formMessage: {
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: fontFamily.medium,
    fontSize: normalize(13),
  },
  formError: {
    color: '#B42318',
  },
  formSuccess: {
    color: brand.primary,
  },
});
