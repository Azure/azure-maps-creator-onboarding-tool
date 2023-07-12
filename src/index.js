import React from 'react';
import { render } from 'react-dom';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

import { routes } from 'pages/routes';
import 'common/translations/i18n';
import './index.css';
import 'azure-maps-control/dist/atlas.min.css';

initializeIcons();

render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <RouterProvider router={createHashRouter(routes)} />
    </FluentProvider>
  </React.StrictMode>
  , document.getElementById('root'));