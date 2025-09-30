import { navigate } from 'gatsby-link';
import * as React from 'react';
import { PageRoutes } from '../pages/PageRoutes';
import { useUserAccountContext } from '../contexts/UserAccountProvider';
import { useUserSettingsContext } from '../contexts/UserSettingsProvider';
import { REDIRECT_QUERY_PARAM_KEY } from '../pages/DefaultLoginPage';

export const useRequireLogin = (postLoginRedirectRoute: string | undefined = undefined): [boolean, boolean] => {
  const userAccountLoader = useUserAccountContext();
  const userSettingsLoader = useUserSettingsContext();
  const fullyLoaded =
    !userAccountLoader.loading &&
    (!userAccountLoader.user || (!userSettingsLoader.loading && !!userSettingsLoader.userSettings));

  React.useEffect(() => {
    if (fullyLoaded && !userAccountLoader.user && postLoginRedirectRoute) {
      navigate(`${PageRoutes.login}?${REDIRECT_QUERY_PARAM_KEY}=${encodeURIComponent(postLoginRedirectRoute)}`);
    }
  }, [fullyLoaded, postLoginRedirectRoute, userAccountLoader.user]);

  const loggedIn =
    !userAccountLoader.loading &&
    !!userAccountLoader.user &&
    !userSettingsLoader.loading &&
    !!userSettingsLoader.userSettings;

  return [loggedIn, fullyLoaded];
};
