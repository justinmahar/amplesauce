/**
 * Configure your Gatsby Browser APIs here. This file is also where your styles go.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import * as React from 'react';
import { AppProvider } from './src/components/contexts/AppProvider';

// === CSS/LESS/SASS imports ===
import './src/styles/styles.scss';

// == Bootstrap ==
import './src/styles/bootstrap-overrides.scss';

// == Bootswatch ==
// require('bootswatch/dist/cerulean/bootstrap.min.css');
// require('bootswatch/dist/cosmo/bootstrap.min.css');
// require('bootswatch/dist/cyborg/bootstrap.min.css');
// require('bootswatch/dist/darkly/bootstrap.min.css');
// require('bootswatch/dist/flatly/bootstrap.min.css');
// require('bootswatch/dist/journal/bootstrap.min.css');
// require('bootswatch/dist/litera/bootstrap.min.css');
// require('bootswatch/dist/lumen/bootstrap.min.css');
// require('bootswatch/dist/lux/bootstrap.min.css');
// require('bootswatch/dist/materia/bootstrap.min.css');
// require('bootswatch/dist/minty/bootstrap.min.css');
// require('bootswatch/dist/morph/bootstrap.min.css');
// require('bootswatch/dist/pulse/bootstrap.min.css');
// require('bootswatch/dist/quartz/bootstrap.min.css');
// require('bootswatch/dist/sandstone/bootstrap.min.css');
// require('bootswatch/dist/simplex/bootstrap.min.css');
// require('bootswatch/dist/sketchy/bootstrap.min.css');
// require('bootswatch/dist/slate/bootstrap.min.css');
// require('bootswatch/dist/solar/bootstrap.min.css');
// require('bootswatch/dist/spacelab/bootstrap.min.css');
// require('bootswatch/dist/superhero/bootstrap.min.css');
// require('bootswatch/dist/united/bootstrap.min.css');
// require('bootswatch/dist/vapor/bootstrap.min.css');
// require('bootswatch/dist/yeti/bootstrap.min.css');
// require('bootswatch/dist/zephyr/bootstrap.min.css');

export const wrapRootElement = ({ element }) => {
  return <AppProvider>{element}</AppProvider>;
};

// Reload when there's an update
const onServiceWorkerUpdateReadyFunction = (_apiCallbackContext) => {
  window.location.reload();
};
export const onServiceWorkerUpdateReady = onServiceWorkerUpdateReadyFunction;
