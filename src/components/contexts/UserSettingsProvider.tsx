import * as React from 'react';
import { ElementProps } from 'react-html-props';
import { UserAccountLoader } from '../hooks/useUserAccount';
import { UserSettingsLoader, useUserSettings } from '../hooks/useUserSettings';
import { useUserAccountContext } from './UserAccountProvider';
import { UserSettings } from '../firebase/firestore/models/UserSettings';

const defaultUserSettings: UserSettingsLoader = {
  userSettings: undefined,
  loading: false,
  docSnapshot: undefined,
  error: undefined,
  pendingCreation: false,
};

export const UserSettingsContext = React.createContext<UserSettingsLoader>(defaultUserSettings);

/**
 * Provider for user settings (retrieved from Firebase).
 *
 * Depends on the user account context.
 */
export function UserSettingsProvider({ children }: ElementProps): React.JSX.Element {
  const userAccountLoader: UserAccountLoader = useUserAccountContext();
  const userSettingsLoader: UserSettingsLoader = useUserSettings(userAccountLoader.user?.uid);
  return <UserSettingsContext.Provider value={userSettingsLoader}>{children}</UserSettingsContext.Provider>;
}

export const useUserSettingsContext = (): UserSettingsLoader => {
  return React.useContext(UserSettingsContext);
};

export function useUserSetting<T>(getter: (s: UserSettings) => T): T | undefined {
  const userSettingsLoader = useUserSettingsContext();
  return React.useMemo(
    () => (userSettingsLoader.userSettings ? getter(userSettingsLoader.userSettings) : undefined),
    [userSettingsLoader.userSettings],
  );
}
