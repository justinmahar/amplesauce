import classNames from 'classnames';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { LocalSettingsDefaults, LocalSettingsKeys } from '../settings/LocalSettings';
import { useLocalSettingsContext } from './LocalSettingsProvider';

export interface ThemeOptions {
  darkModeEnabled: boolean;
}

const defaultThemeOptions: ThemeOptions = {
  darkModeEnabled: false,
};

export const ThemeContext = React.createContext<ThemeOptions>(defaultThemeOptions);

export function ThemeProvider(props: any): React.JSX.Element {
  const localSettings = useLocalSettingsContext();
  const [darkModeEnabledVal, , darkModeEnabledValReady] = localSettings[LocalSettingsKeys.darkModeEnabledState];
  const darkModeEnabled = darkModeEnabledVal ?? LocalSettingsDefaults[LocalSettingsKeys.darkModeEnabledState];
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setInitialized(darkModeEnabledValReady);
  }, [initialized, darkModeEnabledValReady]);

  return (
    <ThemeContext.Provider value={{ darkModeEnabled: !!darkModeEnabled }}>
      <Helmet
        htmlAttributes={{
          'data-bs-theme': darkModeEnabled ? 'dark' : 'light',
          class: classNames(initialized ? 'initialized' : 'uninitialized'),
        }}
      >
        <meta name="color-scheme" content="light dark"></meta>
      </Helmet>
      {props.children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = (): ThemeOptions => {
  return React.useContext(ThemeContext);
};
