import React from 'react';
import { useSiteSettingsContext } from '../components/contexts/SiteSettingsProvider';
import { useUserSettingsContext } from '../components/contexts/UserSettingsProvider';
import { useUser } from '../components/contexts/UserAccountProvider';

const setupUserEndpoint = 'https://us-central1-ample-sauce.cloudfunctions.net/setupUser';

export const useProfileSetupMediator = () => {
  const siteSettings = useSiteSettingsContext();
  const userSettingsLoader = useUserSettingsContext();
  const user = useUser();
  const pendingCreation = userSettingsLoader.pendingCreation;
  const [executed, setExecuted] = React.useState(false);
  const [shouldCreateProfile, setShouldCreateProfile] = React.useState(false);

  React.useEffect(() => {
    if (user && pendingCreation && !shouldCreateProfile && !executed) {
      setShouldCreateProfile(true);
    }
  }, [pendingCreation, executed, shouldCreateProfile, user]);

  React.useEffect(() => {
    if (shouldCreateProfile && !executed) {
      setShouldCreateProfile(false);
      setExecuted(true);
      const endpoint = setupUserEndpoint;
      // console.log('Setting up profile...', endpoint);
      const setupArgs = {
        userId: `${user?.uid}`,
      };
      fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json', // See: https://firebase.google.com/docs/functions/http-events#read_values_from_the_request
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setupArgs),
      })
        .then((response) => {
          response
            .json()
            .then((json) => {
              // console.log(json);
            })
            .catch((e) => console.error(e));
        })
        .catch((reason) => console.error(reason));
    }
  }, [executed, shouldCreateProfile, siteSettings?.data.site.siteMetadata.siteEnvironment, user?.uid]);
};
