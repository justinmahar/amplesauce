import { navigate } from 'gatsby-link';
import md5 from 'md5';
import React from 'react';
import { useLocalStorage } from 'react-storage-complete';
import { PageRoutes } from '../pages/PageRoutes';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';

export const usePasswordProtection = () => {
  const siteSettings = useSiteSettingsContext();
  const [accessGranted, setAccessGranted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const passwordHashStorageOptions = React.useMemo(() => {
    return {
      prefix: `[${siteSettings?.data.site.siteMetadata.siteName}]`,
    };
  }, [siteSettings?.data.site.siteMetadata.siteName]);
  const [passwordHash, setPasswordHash] = useLocalStorage('passwordHash', 'none', passwordHashStorageOptions);

  const setPassword = (newPassword: string) => {
    const newPasswordHash = md5(newPassword);
    setPasswordHash(newPasswordHash);
  };

  React.useEffect(() => {
    const unlocked = !!(
      siteSettings &&
      (siteSettings.data.settingsYaml.sitePasswordHash === 'none' ||
        (passwordHash && siteSettings && passwordHash === siteSettings.data.settingsYaml.sitePasswordHash))
    );
    setAccessGranted(unlocked);
    setLoading(false);
  }, [passwordHash, siteSettings]);

  return {
    accessGranted,
    passwordHash: React.useMemo(() => passwordHash ?? 'none', [passwordHash]),
    setPassword,
    Redirection: () => {
      if (!loading && !accessGranted) {
        navigate(PageRoutes.password);
      }
      return <></>;
    },
  };
};
