import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { AppInput, AppText, AppView } from '../../components';
import type { AppInputProps } from '../../components/AppInput';
import { profileColors, profileStyles } from './profileStyles';

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
}) => (
  <AppView style={[profileStyles.fieldSpacing, containerStyle]}>
    <AppText style={[profileStyles.fieldLabel, labelStyle]}>{label}</AppText>
    <AppInput
      {...inputProps}
      inputWrapperStyle={[profileStyles.inputWrapper, inputWrapperStyle]}
      style={[profileStyles.inputText, style]}
      placeholderTextColor={placeholderTextColor ?? profileColors.inputPlaceholder}
      containerStyle={{ marginBottom: 0 }}
    />
  </AppView>
);
