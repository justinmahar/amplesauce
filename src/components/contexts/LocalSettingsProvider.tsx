import * as React from 'react';
import { ElementProps } from 'react-html-props';
import { LocalSettingsKeys, LocalSettingsType, useLocalSettings } from '../settings/LocalSettings';

const defaultLocalSettings = Object.keys(LocalSettingsKeys)
  // StorageState<T> is: [T | null | undefined, (val: T | null | undefined) => void, boolean, () => void, string]
  .map((k) => ({ [k]: [undefined, () => {}, false, () => {}, 'undefined'] }))
  .reduce((s, v) => ({ ...s, ...v })) as LocalSettingsType;

export const LocalSettingsContext = React.createContext<LocalSettingsType>(defaultLocalSettings);

/**
 * Provider for local settings (retrieved from localStorage).
 *
 * Depends on the user account context.
 */
export function LocalSettingsProvider({ children }: ElementProps): React.JSX.Element {
  const localSettings = useLocalSettings();
  return <LocalSettingsContext.Provider value={localSettings}>{children}</LocalSettingsContext.Provider>;
}

export const useLocalSettingsContext = (): LocalSettingsType => {
  return React.useContext(LocalSettingsContext);
};
