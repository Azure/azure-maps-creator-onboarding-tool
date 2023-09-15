export const PATHS = {
  INDEX: '/',
  PROCESSING: '/processing',
  CREATE_GEOREFERENCE: '/create-georeference',
  REVIEW_CREATE: '/review-create',
  CONVERSION: '/review-create/conversion',
  PAST_CONVERSION: '/past-conversion',
  CONVERSIONS: '/conversions',
  LAYERS: '/layers',
  LEVELS: '/levels',
  INVALID_PATH: '/*',
};

export const ROUTE_NAME_BY_PATH = {
  [PATHS.INDEX]: 'home',
  [PATHS.PROCESSING]: 'processing',
  [PATHS.CREATE_GEOREFERENCE]: 'prepare.drawing.package',
  [PATHS.LAYERS]: 'prepare.drawing.package',
  [PATHS.LEVELS]: 'prepare.drawing.package',
  [PATHS.INVALID_PATH]: 'redirect',
  [PATHS.REVIEW_CREATE]: 'prepare.drawing.package',
  [PATHS.CONVERSION]: 'create.indoor.map',
  [PATHS.CONVERSIONS]: 'All conversions',
};

export const TRUNCATE_FRACTION_DIGITS = 8;

export const HTTP_STATUS_CODE = {
  ACCEPTED: 202,
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
};

export const isStagingEnv = process.env.REACT_APP_STAGING_ENV === 'true';