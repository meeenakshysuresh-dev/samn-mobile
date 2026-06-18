import { useAuth } from './useAuth';
import { useTaskSync } from './useTaskSync';

export const useTaskUserContext = () => {
  const { user, userProfile } = useAuth();

  const userId = user?.uid ?? 'guest-user';
  const userName = userProfile?.fullName ?? user?.displayName ?? 'Guest';

  useTaskSync(user?.uid ?? null);

  return { userId, userName };
};
