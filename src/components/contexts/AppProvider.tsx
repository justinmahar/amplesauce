import * as React from 'react';
import { ElementProps } from 'react-html-props';
import { CustomAppProvider } from './CustomAppProvider';
import { EventEmitterProvider } from './EventEmitterProvider';
import { LocalSettingsProvider } from './LocalSettingsProvider';
import { SiteSettingsProvider } from './SiteSettingsProvider';
import { UserAccountProvider } from './UserAccountProvider';
import { UserSettingsProvider } from './UserSettingsProvider';
import { ThemeProvider } from './ThemeProvider';
import { GlobalStateProvider } from './GlobalStateProvider';
import { AppMediator } from '../../mediators/AppMediator';
import { WorkspaceProvider } from './WorkspaceProvider';

/**
 * This is a custom context provider wrapper that includes all core contexts, such as the user account and logged in user's settings.
 * Wrap anything you'd like to be able to consume these contexts.
 *
 * This pattern is used to prevent repeated account and settings queries throughout the app, which would drive up database read costs.
 *
 * @param props Contains children receiving all contexts.
 */
export const AppProvider = ({ children }: ElementProps): React.JSX.Element => {
  return (
    <EventEmitterProvider>
      <GlobalStateProvider>
        <SiteSettingsProvider>
          <UserAccountProvider>
            <UserSettingsProvider>
              <WorkspaceProvider>
                <LocalSettingsProvider>
                  <ThemeProvider>
                    <CustomAppProvider>
                      <AppMediator>{children}</AppMediator>
                    </CustomAppProvider>
                  </ThemeProvider>
                </LocalSettingsProvider>
              </WorkspaceProvider>
            </UserSettingsProvider>
          </UserAccountProvider>
        </SiteSettingsProvider>
      </GlobalStateProvider>
    </EventEmitterProvider>
  );
};
