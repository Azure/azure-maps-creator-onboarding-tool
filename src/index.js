import React from 'react';
import { render } from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';

import { routes } from 'pages/routes';
import 'common/translations/i18n';
import './index.css';

initializeIcons();

render(
  <React.StrictMode>
    <RouterProvider router={createBrowserRouter(routes)} />
  </React.StrictMode>
  , document.getElementById('root'));