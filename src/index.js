import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { routes } from 'pages/routes';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import 'azure-maps-control/dist/atlas.min.css';
import 'azure-maps-indoor/dist/atlas-indoor.min.css';
import 'common/translations/i18n';
import './index.css';

initializeIcons();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <RouterProvider router={createHashRouter(routes)} />
    </FluentProvider>
  </React.StrictMode>
);
