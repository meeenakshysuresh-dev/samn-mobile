import React, { useCallback, useEffect, useState } from 'react';
import {
  // Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import {
  AppIcon,
  AppText,
  AppView,
  CommonHeader,
  HeaderAppWordmark,
} from '../../components';
// Image upload temporarily disabled
// import { usePhotoPicker } from '../../components/PhotoPicker/usePhotoPicker';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmExitOnBack } from '../../hooks/useConfirmExitOnBack';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import { useAppTheme } from '../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../theme/tokens';
import { ProfileFormField } from './ProfileFormField';
import { profileStyles } from './profileStyles';
import { getInitials } from '../../utils/userName';
import { hasSkill, normalizeSkills } from '../../utils/skills';

const mapProfileToForm = (profile: ReturnType<typeof useAuth>['userProfile']) => ({
  fullName: profile?.fullName ?? '',
  college: profile?.college ?? '',
  department: profile?.department ?? '',
  skills: normalizeSkills(profile?.skills),
  aboutMe: profile?.aboutMe ?? '',
  photoUrl: profile?.photoUrl ?? '',
});

export const ProfileScreen = () => {
  const tabBarInset = useTabBarInset();
  const { theme } = useAppTheme();
  const loader = useLoaderStore();
  const { user, userProfile, saveProfileDetails, authLoading, error, clearError } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [aboutMe, setAboutMe] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [skillDraft, setSkillDraft] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  useConfirmExitOnBack({ enabled: !isEditing });

  const resetFormFromProfile = useCallback(() => {
    const form = mapProfileToForm(userProfile);
    setFullName(form.fullName || user?.displayName || '');
    setCollege(form.college);
    setDepartment(form.department);
    setSkills(form.skills);
    setAboutMe(form.aboutMe);
    setPhotoUri(form.photoUrl);
    setSkillDraft('');
    setIsAddingSkill(false);
  }, [user?.displayName, userProfile]);

  useEffect(() => {
    if (isEditing) {
      return;
    }
    resetFormFromProfile();
  }, [
    isEditing,
    resetFormFromProfile,
    user?.displayName,
    user?.uid,
    userProfile?.aboutMe,
    userProfile?.college,
    userProfile?.department,
    userProfile?.fullName,
    userProfile?.photoUrl,
    userProfile?.skills,
    userProfile?.uid,
  ]);

  // Image upload temporarily disabled
  // const photoPicker = usePhotoPicker({
  //   onPicked: result => {
  //     const uri = result.asset.uri;
  //     if (uri) {
  //       setPhotoUri(uri);
  //     }
  //   },
  // });

  const addSkill = useCallback(() => {
    const trimmed = skillDraft.trim();
    if (!trimmed) {
      setIsAddingSkill(false);
      setSkillDraft('');
      return;
    }

    if (!hasSkill(skills, trimmed)) {
      setSkills(current => [...current, trimmed]);
    }
    setSkillDraft('');
    setIsAddingSkill(false);
  }, [skillDraft, skills]);

  const removeSkill = useCallback((index: number) => {
    setSkills(current => current.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const handleEdit = useCallback(() => {
    clearError();
    resetFormFromProfile();
    setIsEditing(true);
  }, [clearError, resetFormFromProfile]);

  const handleCancel = useCallback(() => {
    clearError();
    resetFormFromProfile();
    setIsEditing(false);
  }, [clearError, resetFormFromProfile]);

  const handleSave = useCallback(async () => {
    clearError();
    loader.show();

    try {
      await saveProfileDetails({
        fullName: fullName.trim(),
        college: college.trim(),
        department: department.trim(),
        skills: normalizeSkills(skills),
        aboutMe: aboutMe.trim(),
        ...(userProfile?.photoUrl ? { photoUrl: userProfile.photoUrl } : {}),
      });
      setIsEditing(false);
    } catch {
      // surfaced via auth context
    } finally {
      loader.hide();
    }
  }, [
    aboutMe,
    clearError,
    college,
    department,
    fullName,
    loader,
    saveProfileDetails,
    skills,
    userProfile?.photoUrl,
  ]);

  const displayName = fullName.trim() || userProfile?.fullName || user?.displayName || '';
  const initials = getInitials(displayName);

  return (
    <AppView style={[profileStyles.screen, { backgroundColor: theme.background }]}>
      <CommonHeader
        title={isEditing ? 'Edit Profile' : 'Profile Details'}
        showBackButton={false}
        safeArea={false}
        leftContent={<HeaderAppWordmark />}
        rightIcon={isEditing ? undefined : 'edit'}
        onRightPress={isEditing ? undefined : handleEdit}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            profileStyles.scrollContent,
            { paddingBottom: tabBarInset + 32 },
          ]}
        >
          <AppView style={profileStyles.photoSection}>
            <AppView
              style={[
                profileStyles.avatarCircle,
                { backgroundColor: theme.primaryBgSubtle, borderColor: theme.primaryBorderSubtle },
              ]}
            >
              <AppText
                style={[profileStyles.avatarInitials, { color: theme.textBrandSecondary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {initials || '?'}
              </AppText>
            </AppView>
            {/* Image upload temporarily disabled
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={profileStyles.photoImage} resizeMode="cover" />
            ) : (
              <AppView style={profileStyles.photoPlaceholder}>
                <AppIcon name="user" width={40} height={40} color={brand.primary} />
              </AppView>
            )}
            {isEditing ? (
              <Pressable style={profileStyles.photoEditButton} onPress={photoPicker.open}>
                <AppIcon name="camera" width={16} height={16} color="#FFFFFF" />
              </Pressable>
            ) : null}
            {isEditing ? (
              <Pressable onPress={photoPicker.open}>
                <AppText style={profileStyles.changePhotoLink}>Change Photo</AppText>
              </Pressable>
            ) : null}
            {isEditing ? photoPicker.PickerSheet : null}
            */}
          </AppView>

          <ProfileFormField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
            editable={isEditing}
          />

          <ProfileFormField
            label="College"
            value={college}
            onChangeText={setCollege}
            placeholder="University or college name"
            autoCapitalize="words"
            editable={isEditing}
          />

          <ProfileFormField
            label="Department"
            value={department}
            onChangeText={setDepartment}
            placeholder="Your department"
            autoCapitalize="words"
            editable={isEditing}
          />

          <AppView style={profileStyles.fieldSpacing}>
            <AppText style={[profileStyles.fieldLabel, { color: theme.textBrandSecondary }]}>Skills</AppText>
            <AppView style={[profileStyles.skillsRow, { backgroundColor: theme.surfaceSecondary }]}>
              {skills.map((skill, index) =>
                isEditing ? (
                  <Pressable
                    key={`skill-${index}`}
                    style={[profileStyles.skillChip, { backgroundColor: theme.card, borderColor: theme.primary }]}
                    onPress={() => removeSkill(index)}
                  >
                    <AppText style={[profileStyles.skillChipText, { color: theme.textBrandSecondary }]}>{skill}</AppText>
                    <AppIcon name="x" width={12} height={12} color={theme.textBrandSecondary} />
                  </Pressable>
                ) : (
                  <AppView
                    key={`skill-${index}`}
                    style={[profileStyles.skillChip, { backgroundColor: theme.card, borderColor: theme.primary }]}
                  >
                    <AppText style={[profileStyles.skillChipText, { color: theme.textBrandSecondary }]}>{skill}</AppText>
                  </AppView>
                ),
              )}

              {isEditing && isAddingSkill ? (
                <TextInput
                  value={skillDraft}
                  onChangeText={setSkillDraft}
                  placeholder="Add skill"
                  placeholderTextColor={theme.textPlaceholder}
                  style={[profileStyles.skillInput, { color: theme.textPrimary }]}
                  autoFocus
                  onSubmitEditing={addSkill}
                  onBlur={addSkill}
                  returnKeyType="done"
                />
              ) : null}
              {isEditing && !isAddingSkill ? (
                <Pressable
                  style={[profileStyles.addSkillButton, { backgroundColor: theme.primary }]}
                  onPress={() => setIsAddingSkill(true)}
                  accessibilityLabel="Add skill"
                >
                  <AppIcon name="plus" width={18} height={18} color={theme.textOnBrand} />
                </Pressable>
              ) : null}
            </AppView>
            {!isEditing && skills.length === 0 ? (
              <AppText style={{ color: theme.textSecondary, marginTop: 4 }}>
                No skills added yet.
              </AppText>
            ) : null}
          </AppView>

          <AppView style={profileStyles.fieldSpacing}>
            <AppText style={[profileStyles.fieldLabel, { color: theme.textBrandSecondary }]}>About Me</AppText>
            {isEditing ? (
              <TextInput
                value={aboutMe}
                onChangeText={setAboutMe}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.textPlaceholder}
                style={[
                  profileStyles.textAreaWrapper,
                  profileStyles.inputText,
                  { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, textAlignVertical: 'top' },
                ]}
                multiline
                numberOfLines={5}
              />
            ) : (
              <AppView style={[profileStyles.textAreaWrapper, { backgroundColor: theme.surfaceSecondary }]}>
                <AppText
                  style={[
                    profileStyles.inputText,
                    { color: aboutMe ? theme.textPrimary : theme.textPlaceholder },
                  ]}
                >
                  {aboutMe || 'No description added yet.'}
                </AppText>
              </AppView>
            )}
          </AppView>

          {error ? (
            <AppText style={[profileStyles.formMessage, { color: theme.error }]}>{error}</AppText>
          ) : null}

          {isEditing ? (
            <AppView style={styles.actionRow}>
              <Pressable
                style={[styles.halfButton, styles.cancelButton, { borderColor: theme.primary }]}
                onPress={handleCancel}
                disabled={authLoading}
              >
                <AppIcon name="x" width={18} height={18} color={theme.primary} />
                <AppText style={[styles.cancelLabel, { color: theme.primary }]}>Cancel</AppText>
              </Pressable>
              <Pressable
                style={[
                  styles.halfButton,
                  styles.saveButton,
                  { backgroundColor: theme.primary, borderColor: theme.primary },
                  authLoading && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={authLoading}
              >
                <AppIcon name="check" width={18} height={18} color={theme.textOnBrand} />
                <AppText style={[styles.saveLabel, { color: theme.textOnBrand }]}>Save</AppText>
              </Pressable>
            </AppView>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    width: '100%',
    marginTop: spacing.xl,
  },
  halfButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.2,
    borderColor: brand.primary,
  },
  cancelLabel: {
    color: brand.primary,
    fontFamily: fontFamily.semibold,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: brand.primary,
    borderWidth: 1.2,
    borderColor: brand.primary,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveLabel: {
    color: '#FFFFFF',
    fontFamily: fontFamily.semibold,
    fontSize: 15,
  },
});
