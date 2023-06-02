import { Navigate } from 'react-router-dom';

import CreateManifestPage from './create-manifest';
import ProcessingPage from './processing';
import Georeference from './georeference';
import Layers from './layers';
import Levels from './levels';
import ReviewAndCreate from './review';
import Conversion from './conversion';
import { Route } from 'components';
import { PATHS, ROUTE_NAME_BY_PATH } from 'common';

export const routes = [
  { path: PATHS.INDEX, name: ROUTE_NAME_BY_PATH[PATHS.INDEX], element: <Route component={CreateManifestPage} title='create.new.manifest' /> },
  { path: PATHS.PROCESSING, name: ROUTE_NAME_BY_PATH[PATHS.PROCESSING], element: <ProcessingPage /> },
  { path: PATHS.CREATE_GEOREFERENCE, name: ROUTE_NAME_BY_PATH[PATHS.CREATE_GEOREFERENCE], element: <Route component={Georeference} title='create.manifest' dataRequired /> },
  { path: PATHS.LAYERS, name: ROUTE_NAME_BY_PATH[PATHS.LAYERS], element: <Route component={Layers} title='create.manifest' dataRequired /> },
  { path: PATHS.LEVELS, name: ROUTE_NAME_BY_PATH[PATHS.LEVELS], element: <Route component={Levels} title='create.manifest' dataRequired /> },
  { path: PATHS.REVIEW_CREATE, name: ROUTE_NAME_BY_PATH[PATHS.REVIEW_CREATE], element: <Route component={ReviewAndCreate} title='create.manifest' dataRequired /> },
  { path: PATHS.PREPARE_PACKAGE, name: ROUTE_NAME_BY_PATH[PATHS.PREPARE_PACKAGE], element: <Navigate to={PATHS.LEVELS} />  },
  { path: PATHS.CONVERSION, name: ROUTE_NAME_BY_PATH[PATHS.CONVERSION], element: <Route component={Conversion} dataRequired />  },
  { path: PATHS.INVALID_PATH, name: ROUTE_NAME_BY_PATH[PATHS.INVALID_PATH], element: <Navigate to='/' />  },
];