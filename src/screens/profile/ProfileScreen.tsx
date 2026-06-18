import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import {
  AppButton,
  AppIcon,
  AppText,
  AppView,
  CommonHeader,
} from '../../components';
import { usePhotoPicker } from '../../components/PhotoPicker/usePhotoPicker';
import { useAuth } from '../../hooks/useAuth';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import { brand } from '../../theme/tokens';
import { ProfileFormField } from './ProfileFormField';
import { profileColors, profileStyles } from './profileStyles';

const mapProfileToForm = (profile: ReturnType<typeof useAuth>['userProfile']) => ({
  fullName: profile?.fullName ?? '',
  college: profile?.college ?? '',
  department: profile?.department ?? '',
  skills: profile?.skills ?? [],
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
  const [localMessage, setLocalMessage] = useState<string | null>(null);

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
    resetFormFromProfile();
  }, [resetFormFromProfile]);

  const photoPicker = usePhotoPicker({
    onPicked: result => {
      const uri = result.asset.uri;
      if (uri) {
        setPhotoUri(uri);
      }
    },
  });

  const addSkill = useCallback(() => {
    const trimmed = skillDraft.trim();
    if (!trimmed) {
      setIsAddingSkill(false);
      setSkillDraft('');
      return;
    }

    if (!skills.includes(trimmed)) {
      setSkills(current => [...current, trimmed]);
    }
    setSkillDraft('');
    setIsAddingSkill(false);
  }, [skillDraft, skills]);

  const removeSkill = useCallback((skill: string) => {
    setSkills(current => current.filter(item => item !== skill));
  }, []);

  const handleEdit = () => {
    clearError();
    setLocalMessage(null);
    resetFormFromProfile();
    setIsEditing(true);
  };

  const handleCancel = () => {
    clearError();
    setLocalMessage(null);
    resetFormFromProfile();
    setIsEditing(false);
  };

  const handleSave = async () => {
    clearError();
    setLocalMessage(null);
    loader.show();

    try {
      await saveProfileDetails({
        fullName: fullName.trim(),
        college: college.trim(),
        department: department.trim(),
        skills,
        aboutMe: aboutMe.trim(),
        photoUrl: photoUri.trim() || undefined,
      });
      setLocalMessage('Profile saved successfully.');
      setIsEditing(false);
    } catch {
      // surfaced via auth context
    } finally {
      loader.hide();
    }
  };

  return (
    <AppView style={profileStyles.screen}>
      <CommonHeader title="Profile" showBackButton={false} safeArea />

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
            <AppView style={profileStyles.photoFrame}>
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
            </AppView>
            {isEditing ? (
              <Pressable onPress={photoPicker.open}>
                <AppText style={profileStyles.changePhotoLink}>Change Photo</AppText>
              </Pressable>
            ) : null}
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
              {skills.map(skill =>
                isEditing ? (
                  <Pressable key={skill} style={profileStyles.skillChip} onPress={() => removeSkill(skill)}>
                    <AppText style={profileStyles.skillChipText}>{skill}</AppText>
                    <AppIcon name="x" width={12} height={12} color={brand.primary} />
                  </Pressable>
                ) : (
                  <AppView key={skill} style={profileStyles.skillChip}>
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
          {localMessage ? (
            <AppText style={[profileStyles.formMessage, profileStyles.formSuccess]}>{localMessage}</AppText>
          ) : null}

          {isEditing ? (
            <AppView style={styles.actionRow}>
              <AppButton
                text="Cancel"
                preset="secondary"
                onPress={handleCancel}
                disabled={authLoading}
                style={styles.actionButton}
                labelPreset="authButtonLabel"
                textWeight="semibold"
              />
              <AppButton
                text="Save Profile"
                preset="primary"
                onPress={handleSave}
                disabled={authLoading}
                style={styles.actionButton}
                labelPreset="authButtonLabel"
                textWeight="semibold"
              />
            </AppView>
          ) : (
            <AppButton
              text="Edit Profile"
              preset="primary"
              onPress={handleEdit}
              style={profileStyles.saveButton}
              labelPreset="authButtonLabel"
              textWeight="semibold"
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {isEditing ? photoPicker.PickerSheet : null}
    </AppView>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});
