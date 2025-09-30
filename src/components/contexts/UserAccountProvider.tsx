import * as React from 'react';
import { ElementProps } from 'react-html-props';
import { User } from 'firebase/auth';
import { UserAccountLoader, useUserAccount } from '../hooks/useUserAccount';

const defaultUserAccountLoader: UserAccountLoader = {
  user: undefined,
  loading: false,
  error: undefined,
};

export const UserAccountContext = React.createContext<UserAccountLoader>(defaultUserAccountLoader);

export function UserAccountProvider({ children }: ElementProps): React.JSX.Element {
  const userAccountLoader = useUserAccount();
  return <UserAccountContext.Provider value={userAccountLoader}>{children}</UserAccountContext.Provider>;
}

export const useUserAccountContext = (): UserAccountLoader => {
  return React.useContext(UserAccountContext);
};

export const useUser = (): User | undefined => {
  const user = useUserAccountContext().user;
  return user || undefined;
};
