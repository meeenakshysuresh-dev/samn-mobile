import type { LinkingOptions } from '@react-navigation/native';

import { AUTH_DEEP_LINK_PREFIXES } from '../firebase/config';
import type { RootStackParamList } from './RootNavigator.types';

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: [...AUTH_DEEP_LINK_PREFIXES],
  config: {
    screens: {
      Auth: {
        screens: {
          ResetPassword: {
            path: 'auth',
            parse: {
              oobCode: (value: string) => value,
            },
          },
        },
      },
    },
  },
};
