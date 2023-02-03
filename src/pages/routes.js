import { Navigate } from 'react-router-dom';

import Index from './index/index';
import CreateManifestPage from './create-manifest';
import EditManifestPage from './create-manifest/edit-manifest';
import ProcessingPage from './processing';
import Georeference from './georeference';
import Layers from './layers';
import Levels from './levels';
import { Route } from 'components';
import { PATHS, ROUTE_NAME_BY_PATH } from 'common';

export const routes = [
  { path: PATHS.INDEX, name: ROUTE_NAME_BY_PATH[PATHS.INDEX], element: <Route component={Index} title='get.started' /> },
  { path: PATHS.CREATE_MANIFEST, name: ROUTE_NAME_BY_PATH[PATHS.CREATE_MANIFEST], element: <Route component={CreateManifestPage} title='create.new.manifest' /> },
  { path: PATHS.EDIT_MANIFEST, name: ROUTE_NAME_BY_PATH[PATHS.EDIT_MANIFEST], element: <Route component={EditManifestPage} title='edit.existing.manifest' /> },
  { path: PATHS.PROCESSING, name: ROUTE_NAME_BY_PATH[PATHS.PROCESSING], element: <ProcessingPage /> },
  { path: PATHS.CREATE_GEOREFERENCE, name: ROUTE_NAME_BY_PATH[PATHS.CREATE_GEOREFERENCE], element: <Route component={Georeference} title='create.manifest' dataRequired /> },
  { path: PATHS.LAYERS, name: ROUTE_NAME_BY_PATH[PATHS.LAYERS], element: <Route component={Layers} title='create.manifest' dataRequired /> },
  { path: PATHS.LEVELS, name: ROUTE_NAME_BY_PATH[PATHS.LEVELS], element: <Route component={Levels} title='create.manifest' dataRequired /> },
  { path: PATHS.INVALID_PATH, name: ROUTE_NAME_BY_PATH[PATHS.INVALID_PATH], element: <Navigate to='/' />  },
];