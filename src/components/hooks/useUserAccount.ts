import * as AuthHooks from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import { auth } from '../firebase/firebase-app';

export interface UserAccountLoader {
  user?: User | null;
  loading: boolean;
  error?: Error;
}

/**
 * Hook to load the user's account from Firebase.
 */
export const useUserAccount = (): UserAccountLoader => {
  const [user, loading, error] = auth
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      AuthHooks.useAuthState(auth)
    : [undefined, false, new Error('Firebase not initialized.')];
  return { user, loading, error };
};
