import { CommonActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { resetToRoute } from './navigationRef';
import type {
  AuthStackParamList,
  CreateStackParamList,
  HomeStackParamList,
  MainTabParamList,
  RootStackParamList,
  SettingsStackParamList,
} from './RootNavigator.types';

type CreateStackScreen = keyof CreateStackParamList;
type HomeStackScreen = keyof HomeStackParamList;
type SettingsStackScreen = keyof SettingsStackParamList;

type CreateStackNavigation =
  | NavigationProp<CreateStackParamList>
  | NativeStackNavigationProp<CreateStackParamList>;

type HomeStackNavigation =
  | NavigationProp<HomeStackParamList>
  | NativeStackNavigationProp<HomeStackParamList>;

type SettingsStackNavigation =
  | NavigationProp<SettingsStackParamList>
  | NativeStackNavigationProp<SettingsStackParamList>;

type AuthStackNavigation =
  | NavigationProp<AuthStackParamList>
  | NativeStackNavigationProp<AuthStackParamList>;

type RootStackNavigation =
  | NavigationProp<RootStackParamList>
  | NativeStackNavigationProp<RootStackParamList>;

export const getTabNavigation = (navigation: NavigationProp<ParamListBase>) =>
  navigation.getParent<NavigationProp<MainTabParamList>>();

const resetStackTo = (
  navigation: NavigationProp<ParamListBase>,
  screen: string,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screen }],
    }),
  );
};

export const navigateToCreateStack = (
  navigation: NavigationProp<ParamListBase>,
  screen: CreateStackScreen,
  params?: CreateStackParamList[CreateStackScreen],
) => {
  const tabNavigation = getTabNavigation(navigation);
  if (!tabNavigation) {
    return;
  }

  if (screen === 'MyTasks') {
    tabNavigation.navigate('CreateStack', { screen: 'MyTasks' });
    return;
  }

  tabNavigation.navigate('CreateStack', {
    state: {
      routes: [{ name: 'MyTasks' }, { name: screen, params }],
      index: 1,
    },
  });
};

export const exitCreateStackScreen = (navigation: CreateStackNavigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  const tabNavigation = getTabNavigation(navigation);
  resetStackTo(navigation, 'MyTasks');
  tabNavigation?.navigate('HomeStack', { screen: 'Dashboard' });
};

export const finishCreateTaskFlow = (navigation: CreateStackNavigation) => {
  const tabNavigation = getTabNavigation(navigation);
  resetStackTo(navigation, 'MyTasks');
  tabNavigation?.navigate('CreateStack', { screen: 'MyTasks' });
};

export const exitHomeStackScreen = (navigation: HomeStackNavigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  resetStackTo(navigation, 'Dashboard');
};

export const navigateToHomeStack = (
  navigation: NavigationProp<ParamListBase>,
  screen: HomeStackScreen,
) => {
  const tabNavigation = getTabNavigation(navigation);
  if (!tabNavigation) {
    return;
  }

  if (screen === 'Dashboard') {
    tabNavigation.navigate('HomeStack', { screen: 'Dashboard' });
    return;
  }

  tabNavigation.navigate('HomeStack', {
    state: {
      routes: [{ name: 'Dashboard' }, { name: screen }],
      index: 1,
    },
  });
};

export const exitSettingsStackScreen = (navigation: SettingsStackNavigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  resetStackTo(navigation, 'Settings');
};

export const navigateToSettingsStack = (
  navigation: NavigationProp<ParamListBase>,
  screen: SettingsStackScreen,
) => {
  const tabNavigation = getTabNavigation(navigation);
  if (!tabNavigation) {
    return;
  }

  if (screen === 'Settings') {
    tabNavigation.navigate('SettingsStack', { screen: 'Settings' });
    return;
  }

  tabNavigation.navigate('SettingsStack', {
    state: {
      routes: [{ name: 'Settings' }, { name: screen }],
      index: 1,
    },
  });
};

export const exitAuthScreen = (navigation: AuthStackNavigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  resetStackTo(navigation, 'Login');
};

export const exitRootScreen = (navigation: RootStackNavigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  resetToRoute('MainTabs');
};

export const navigateToChat = (navigation: NavigationProp<ParamListBase>) => {
  getTabNavigation(navigation)?.navigate('ChatStack', { screen: 'Chat' });
};

export const navigateToProfile = (navigation: NavigationProp<ParamListBase>) => {
  getTabNavigation(navigation)?.navigate('ProfileStack', { screen: 'Profile' });
};

export const resetCreateStackToMyTasks = (navigation: CreateStackNavigation) => {
  resetStackTo(navigation, 'MyTasks');
  getTabNavigation(navigation)?.navigate('CreateStack', { screen: 'MyTasks' });
};
