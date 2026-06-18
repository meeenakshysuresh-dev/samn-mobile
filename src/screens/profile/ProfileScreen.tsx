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
} from '../../components';
// Image upload temporarily disabled
// import { usePhotoPicker } from '../../components/PhotoPicker/usePhotoPicker';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmExitOnBack } from '../../hooks/useConfirmExitOnBack';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import { brand, fontFamily, spacing } from '../../theme/tokens';
import { ProfileFormField } from './ProfileFormField';
import { profileColors, profileStyles } from './profileStyles';
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
    <AppView style={profileStyles.screen}>
      <CommonHeader
        title={isEditing ? 'Edit Profile' : 'Profile Details'}
        showBackButton={false}
        safeArea={false}
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
            <AppView style={profileStyles.avatarCircle}>
              <AppText
                style={profileStyles.avatarInitials}
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
            <AppText style={profileStyles.fieldLabel}>Skills</AppText>
            <AppView style={profileStyles.skillsRow}>
              {skills.map((skill, index) =>
                isEditing ? (
                  <Pressable
                    key={`skill-${index}`}
                    style={profileStyles.skillChip}
                    onPress={() => removeSkill(index)}
                  >
                    <AppText style={profileStyles.skillChipText}>{skill}</AppText>
                    <AppIcon name="x" width={12} height={12} color={brand.primary} />
                  </Pressable>
                ) : (
                  <AppView key={`skill-${index}`} style={profileStyles.skillChip}>
                    <AppText style={profileStyles.skillChipText}>{skill}</AppText>
                  </AppView>
                ),
              )}

              {isEditing && isAddingSkill ? (
                <TextInput
                  value={skillDraft}
                  onChangeText={setSkillDraft}
                  placeholder="Add skill"
                  placeholderTextColor={profileColors.inputPlaceholder}
                  style={profileStyles.skillInput}
                  autoFocus
                  onSubmitEditing={addSkill}
                  onBlur={addSkill}
                  returnKeyType="done"
                />
              ) : null}
              {isEditing && !isAddingSkill ? (
                <Pressable
                  style={profileStyles.addSkillButton}
                  onPress={() => setIsAddingSkill(true)}
                  accessibilityLabel="Add skill"
                >
                  <AppIcon name="plus" width={18} height={18} color="#FFFFFF" />
                </Pressable>
              ) : null}
            </AppView>
            {!isEditing && skills.length === 0 ? (
              <AppText style={{ color: profileColors.inputPlaceholder, marginTop: 4 }}>
                No skills added yet.
              </AppText>
            ) : null}
          </AppView>

          <AppView style={profileStyles.fieldSpacing}>
            <AppText style={profileStyles.fieldLabel}>About Me</AppText>
            {isEditing ? (
              <TextInput
                value={aboutMe}
                onChangeText={setAboutMe}
                placeholder="Tell us about yourself..."
                placeholderTextColor={profileColors.inputPlaceholder}
                style={[profileStyles.textAreaWrapper, profileStyles.inputText, { textAlignVertical: 'top' }]}
                multiline
                numberOfLines={5}
              />
            ) : (
              <AppView style={profileStyles.textAreaWrapper}>
                <AppText
                  style={[
                    profileStyles.inputText,
                    { color: aboutMe ? '#111827' : profileColors.inputPlaceholder },
                  ]}
                >
                  {aboutMe || 'No description added yet.'}
                </AppText>
              </AppView>
            )}
          </AppView>

          {error ? (
            <AppText style={[profileStyles.formMessage, profileStyles.formError]}>{error}</AppText>
          ) : null}

          {isEditing ? (
            <AppView style={styles.actionRow}>
              <Pressable
                style={[styles.halfButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={authLoading}
              >
                <AppIcon name="x" width={18} height={18} color={brand.primary} />
                <AppText style={styles.cancelLabel}>Cancel</AppText>
              </Pressable>
              <Pressable
                style={[styles.halfButton, styles.saveButton, authLoading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={authLoading}
              >
                <AppIcon name="check" width={18} height={18} color="#FFFFFF" />
                <AppText style={styles.saveLabel}>Save</AppText>
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
