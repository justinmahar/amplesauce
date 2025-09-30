import { PageProps } from 'gatsby';
import React, { JSX } from 'react';
import CustomIndexPage from '../components/pages/CustomIndexPage';

export default function Index(props: PageProps<any>): JSX.Element {
  return <CustomIndexPage {...props} />;
}

// export function Head() {
//   const localSettings = useLocalSettingsContext();
//   const [darkModeEnabledVal] = localSettings[LocalSettingsKeys.darkModeEnabledState];
//   const darkModeEnabled = darkModeEnabledVal ?? LocalSettingsDefaults[LocalSettingsKeys.darkModeEnabledState];
//   return (
//     <>
//       <meta name="color-scheme" content="light dark"></meta>
//       <html className={classNames(darkModeEnabled && 'dark')} />
//       <script>console.log("hi", "{`${darkModeEnabled}`}")</script>
//     </>
//   );
// }

// Page query goes here
