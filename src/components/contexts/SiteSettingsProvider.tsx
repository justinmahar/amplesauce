import * as React from 'react';
import SiteSettings, { useSiteSettings } from '../../settings/useSiteSettings';

export const SettingsContext = React.createContext<SiteSettings | undefined>(undefined);

export function SiteSettingsProvider(props: any): React.JSX.Element {
  const siteSettings = useSiteSettings();
  return <SettingsContext.Provider value={siteSettings}>{props.children}</SettingsContext.Provider>;
}

export const useSiteSettingsContext = (): SiteSettings | undefined => {
  return React.useContext(SettingsContext);
};
