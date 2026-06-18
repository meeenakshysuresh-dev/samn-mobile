import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppLoader } from './components';
import { RootNavigator } from './navigation';
import { useAppTheme } from './theme/useAppTheme';

const App = () => {
  const { colors, theme } = useAppTheme();

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: theme.background }]}
          edges={['top', 'left', 'right']}
        >
          <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.statusBar} />
          <NavigationContainer theme={colors.navigation}>
            <RootNavigator />
          </NavigationContainer>
          <AppLoader />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default App;
