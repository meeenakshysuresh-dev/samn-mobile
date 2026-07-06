import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { AppInput, AppText, AppView } from '../../components';
import type { AppInputProps } from '../../components/AppInput';
import { useAppTheme } from '../../theme/useAppTheme';
import { profileStyles } from './profileStyles';

type ProfileFormFieldProps = Omit<AppInputProps, 'containerStyle'> & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export const ProfileFormField: React.FC<ProfileFormFieldProps> = ({
  label,
  containerStyle,
  labelStyle,
  inputWrapperStyle,
  style,
  placeholderTextColor,
  ...inputProps
}) => {
  const { theme } = useAppTheme();

  return (
    <AppView style={[profileStyles.fieldSpacing, containerStyle]}>
      <AppText style={[profileStyles.fieldLabel, { color: theme.textBrandSecondary }, labelStyle]}>
        {label}
      </AppText>
      <AppInput
        {...inputProps}
        inputWrapperStyle={[
          profileStyles.inputWrapper,
          { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
          inputWrapperStyle,
        ]}
        style={[profileStyles.inputText, { color: theme.textPrimary }, style]}
        placeholderTextColor={placeholderTextColor ?? theme.textPlaceholder}
        containerStyle={{ marginBottom: 0 }}
      />
    </AppView>
  );
};
