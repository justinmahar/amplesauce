import { navigate } from 'gatsby-link';
import React from 'react';
import { PageRoutes } from '../pages/PageRoutes';
import { useUserAccountContext } from '../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { auth } from '../firebase/firebase-app';

export const useLogout = (): (() => void) => {
  const [shouldLogout, setShouldLogout] = React.useState(false);
  const userAccountLoader = useUserAccountContext();
  const userSettingsLoader = useUserSettingsContext();

  React.useEffect(() => {
    if (shouldLogout) {
      setShouldLogout(false);
      if (!userSettingsLoader.loading && !userAccountLoader.loading && auth) {
        auth.signOut();

        if (userAccountLoader.user) {
          userAccountLoader.user.reload();
        }

        navigate(PageRoutes.login);
      }
    }
  }, [shouldLogout, userAccountLoader.loading, userAccountLoader.user, userSettingsLoader.loading]);

  return () => setShouldLogout(true);
};
