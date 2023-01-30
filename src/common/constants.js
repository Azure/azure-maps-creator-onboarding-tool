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

export const CONSTANTS = {
  GEO: {
    US: {
      TEXT: 'geography.unitedstates',
      URL: 'https://us.atlas.microsoft.com',
    },
    // remove before moving to github
    US_TEST: {
      TEXT: 'geography.unitedstates.test',
      URL: 'https://us.t-azmaps.azurelbs.com',
    },
    EU: {
      TEXT: 'geography.europe',
      URL: 'https://eu.atlas.microsoft.com',
    }
  }
};

export const TRUNCATE_FRACTION_DIGITS = 8;