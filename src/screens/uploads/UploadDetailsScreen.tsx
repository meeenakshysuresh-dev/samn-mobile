import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, AppView, CommonHeader } from '../../components';
import { exitRootScreen } from '../../navigation/stackNavigation';
import type { RootStackParamList } from '../../navigation';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadDetails'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'UploadDetails'>;

export const UploadDetailsScreen = ({ route }: Props) => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader title="Upload Details" onBack={() => exitRootScreen(navigation)} safeArea={false} />
      <View style={styles.content}>
        <AppText preset="heading2" style={{ color: theme.textPrimary, marginBottom: 20 }}>
          Upload Complete
        </AppText>
        <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="caption" style={{ color: theme.textSecondary }}>
            Upload ID
          </AppText>
          <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary, marginTop: 6 }}>
            {route.params.uploadId}
          </AppText>
        </View>
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
});
