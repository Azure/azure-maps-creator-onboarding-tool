export const PATHS = {
  INDEX: '/',
  CREATE_MANIFEST: '/create-manifest',
  EDIT_MANIFEST: '/edit-manifest',
  PROCESSING: '/processing',
  CREATE_GEOREFERENCE: '/create-georeference',
  REVIEW_CREATE: '/review-create',
  PREPARE_PACKAGE: '/prepare-package',
  CONVERSION: '/prepare-package/conversion',
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
  [PATHS.REVIEW_CREATE]: 'create',
  [PATHS.PREPARE_PACKAGE]: 'prepare.drawing.package',
  [PATHS.CONVERSION]: 'create.indoor.map',
};

export const TRUNCATE_FRACTION_DIGITS = 8;