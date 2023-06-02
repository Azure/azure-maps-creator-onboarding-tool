import React from 'react';
import { render } from 'react-dom';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';

import { routes } from 'pages/routes';
import 'common/translations/i18n';
import './index.css';
import 'azure-maps-control/dist/atlas.min.css';

initializeIcons();

render(
  <React.StrictMode>
    <RouterProvider router={createHashRouter(routes)} />
  </React.StrictMode>
  , document.getElementById('root'));