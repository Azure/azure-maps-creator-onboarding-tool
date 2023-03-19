export const PATHS = {
  INDEX: '/',
  CREATE_MANIFEST: '/create-manifest',
  EDIT_MANIFEST: '/edit-manifest',
  PROCESSING: '/processing',
  CREATE_GEOREFERENCE: '/create-georeference',
  LAYERS: '/layers',
  LEVELS: '/levels',
  INVALID_PATH: '/*',
};

export const ROUTE_NAME_BY_PATH = {
  [PATHS.INDEX]: 'home',
  [PATHS.CREATE_MANIFEST]: 'create',
  [PATHS.EDIT_MANIFEST]: 'edit',
  [PATHS.PROCESSING]: 'processing',
  [PATHS.CREATE_GEOREFERENCE]: 'create',
  [PATHS.LAYERS]: 'create',
  [PATHS.LEVELS]: 'create',
  [PATHS.INVALID_PATH]: 'redirect',
};

export const TRUNCATE_FRACTION_DIGITS = 8;