import React from 'react';
import { useLocalStorage } from 'react-storage-complete';
import { useSiteSettingsContext } from '../contexts/SiteSettingsProvider';
import { useUserAccountContext } from '../contexts/UserAccountProvider';

/**
 * Local settings for the application.
 */
export enum LocalSettingsKeys {
  adminViewDisabledState = 'adminViewDisabledState',
  templateState = 'templateState',
  darkModeEnabledState = 'darkModeEnabledState',
}

export const LocalSettingsDefaults = {
  [LocalSettingsKeys.adminViewDisabledState]: false,
  [LocalSettingsKeys.templateState]: false,
  [LocalSettingsKeys.darkModeEnabledState]: true,
};

export const useLocalSettings = () => {
  const siteSettings = useSiteSettingsContext();
  const userAccountLoader = useUserAccountContext();
  const userUid = React.useMemo(() => userAccountLoader.user?.uid ?? 'guest', [userAccountLoader.user?.uid]);
  const prefix = React.useMemo(
    () => `[${siteSettings?.data.site.siteMetadata.siteUrl}].${userUid}`,
    [siteSettings?.data.site.siteMetadata.siteUrl, userUid],
  );
  const storageOptions = React.useMemo(() => {
    return {
      prefix,
    };
  }, [prefix]);

  return {
    [LocalSettingsKeys.adminViewDisabledState]: useLocalStorage(
      LocalSettingsKeys.adminViewDisabledState,
      LocalSettingsDefaults[LocalSettingsKeys.adminViewDisabledState],
      storageOptions,
    ),
    [LocalSettingsKeys.templateState]: useLocalStorage(
      LocalSettingsKeys.templateState,
      LocalSettingsDefaults[LocalSettingsKeys.templateState],
      storageOptions,
    ),
    [LocalSettingsKeys.darkModeEnabledState]: useLocalStorage(
      LocalSettingsKeys.darkModeEnabledState,
      LocalSettingsDefaults[LocalSettingsKeys.darkModeEnabledState],
      storageOptions,
    ),
  };
};

export type LocalSettingsType = ReturnType<typeof useLocalSettings>;
