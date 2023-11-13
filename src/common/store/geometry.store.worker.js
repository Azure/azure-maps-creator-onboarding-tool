import { combine, featureCollection, polygon, union } from '@turf/turf';
import { TRUNCATE_FRACTION_DIGITS } from 'common/constants';

// almost everything in this file was copied from proj4 package - https://github.com/proj4js.
// which was working too slow for the number of calculations we needed to perform
// code here is just a copy-paste of proj4 with minor perf optimizations and unnecessary code cut off
// translateCoordinateInMetersIntoDegrees function here performs ~10 times faster than original transform function.

// constants copied from https://github.com/proj4js/proj4js/blob/master/lib/constants/values.js
const D2R = 0.01745329251994329577;
const R2D = 57.29577951308232088;
const es = 0.006694379990141316;
const SPI = 3.14159265359;
// default k0 copied from https://github.com/proj4js/proj4js/blob/master/lib/Proj.js
const k0 = 1.0;
const TWO_PI = Math.PI * 2;

// eslint-disable-next-line no-restricted-globals
self.onmessage = function ({ data }) {
  // eslint-disable-line no-restricted-globals
  // wrapped this in try catch to ignore errors thrown by union function
  // truncating coordinates in unionFixed vastly fixed it, but it still fails sometimes
  try {
    postMessage(onMessage(data));
  } catch {}
};

export function onMessage(data) {
  const { dwgLayers, polygonLayers, anchorPoint } = data;
  const filteredPolygonLayers = polygonLayers.filter(layer => dwgLayers.includes(layer.name));

  if (filteredPolygonLayers.length === 0) {
    return null;
  }

  const geometriesByType = splitPolygons(filteredPolygonLayers, anchorPoint.coordinates);
  const combinedPolygons = combinePolygons(geometriesByType.polygons);
  return [unionMultiPolygons(geometriesByType.multiPolygons.concat(combinedPolygons)), anchorPoint];
}

function splitPolygons(polygons, [lon, lat]) {
  return polygons.reduce(
    (acc, val) => {
      if (val.geometry.type === 'MultiPolygon') {
        acc.multiPolygons.push(convertMultiPolygonInMetersToDegrees(val.geometry, [lon, lat]));
      } else if (val.geometry.type === 'Polygon') {
        acc.polygons.push(convertPolygonInMetersToDegrees(val.geometry, [lon, lat]));
      }
      return acc;
    },
    {
      multiPolygons: [],
      polygons: [],
    }
  );
}

function convertMultiPolygonInMetersToDegrees(polygon, [lon, lat]) {
  return {
    type: polygon.type,
    coordinates: polygon.coordinates.map(coordinates =>
      coordinates.map(innerCoordinates =>
        innerCoordinates.map(([lonMeters, latMeters]) =>
          translateCoordinateInMetersIntoDegrees(lon, lat, [lonMeters, latMeters])
        )
      )
    ),
  };
}

function convertPolygonInMetersToDegrees(polygon, [lon, lat]) {
  return {
    type: polygon.type,
    coordinates: polygon.coordinates.map(coordinates =>
      coordinates.map(([lonMeters, latMeters]) =>
        translateCoordinateInMetersIntoDegrees(lon, lat, [lonMeters, latMeters])
      )
    ),
  };
}

function unionMultiPolygons(multiPolygons) {
  if (multiPolygons.length === 0) {
    throw new Error('no polygons provided!');
  }
  const stack = [...multiPolygons];
  if (stack.length === 1) {
    return unionFixed(stack[0], stack[0]).geometry;
  }
  while (stack.length > 1) {
    const firstPolygon = stack.shift();
    try {
      stack[0] = unionFixed(stack[0], firstPolygon).geometry;
    } catch {}
  }

  return stack[0];
}

// without truncating it often fails due to bugs in polygon-clipping transitive dependency
function unionFixed(f1, f2) {
  const polygonsUnion = union(f1, f2);
  polygonsUnion.geometry.coordinates = truncateRecursively(polygonsUnion.geometry.coordinates);
  return polygonsUnion;
}

function combinePolygons(polygons) {
  const collection = featureCollection(polygons.map(p => polygon(p.coordinates)));
  return combine(collection).features.map(c => c.geometry);
}

// this function is simplified version of https://github.com/proj4js/proj4js/blob/master/lib/transform.js
export function translateCoordinateInMetersIntoDegrees(lon, lat, meters) {
  const lat0 = lat * D2R;
  const long0 = lon * D2R;
  const { Qn, Zb, cgb, utg } = getConsts(es, k0, lat0);

  let point = { x: meters[0], y: meters[1] };
  point = inverse(point, long0, Qn, Zb, cgb, utg); // Convert Cartesian to longlat

  point = {
    x: point.x * R2D,
    y: point.y * R2D,
  };

  return [truncateNumber(point.x), truncateNumber(point.y)];
}

function truncateRecursively(coordinates) {
  if (typeof coordinates === 'number') {
    return truncateNumber(coordinates);
  }
  return coordinates.map(truncateRecursively);
}

export function truncateNumber(num) {
  return parseFloat(num.toFixed(TRUNCATE_FRACTION_DIGITS));
}

// https://github.com/proj4js/proj4js/blob/master/lib/projections/etmerc.js
function getConsts(es, k0, lat0) {
  const cgb = [];
  const cbg = [];
  const utg = [];
  const gtu = [];

  const f = es / (1 + Math.sqrt(1 - es));
  const n = f / (2 - f);
  let np = n;

  cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675))))));
  cbg[0] = n * (-2 + n * (2 / 3 + n * (4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));

  np = np * n;
  cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
  cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * (-13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));

  np = np * n;
  cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
  cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));

  np = np * n;
  cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
  cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * (-24832 / 14175)));

  np = np * n;
  cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
  cbg[4] = np * (-734 / 315 + n * (109598 / 31185));

  np = np * n;
  cgb[5] = np * (601676 / 22275);
  cbg[5] = np * (444337 / 155925);

  np = Math.pow(n, 2);
  const Qn = (k0 / (1 + n)) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));

  utg[0] = n * (-0.5 + n * (2 / 3 + n * (-37 / 96 + n * (1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
  gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));

  utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
  gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));

  np = np * n;
  utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720))));
  gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));

  np = np * n;
  utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
  gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));

  np = np * n;
  utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
  gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));

  np = np * n;
  utg[5] = np * (-20648693 / 638668800);
  gtu[5] = np * (212378941 / 319334400);

  const Z = gatg(cbg, lat0);
  const Zb = -Qn * (Z + clens(gtu, 2 * Z));

  return {
    Qn,
    Zb,
    cgb,
    utg,
  };
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/gatg.js
function gatg(pp, B) {
  const cos_2B = 2 * Math.cos(2 * B);
  let i = pp.length - 1;
  let h1 = pp[i];
  let h2 = 0;
  let h;

  while (--i >= 0) {
    h = -h2 + cos_2B * h1 + pp[i];
    h2 = h1;
    h1 = h;
  }

  return B + h * Math.sin(2 * B);
}

// https://github.com/proj4js/proj4js/blob/master/lib/projections/etmerc.js
function inverse(p, long0, Qn, Zb, cgb, utg) {
  const a = 6378137;
  const x0 = 0;
  const y0 = 0;

  let Ce = (p.x - x0) * (1 / a);
  let Cn = (p.y - y0) * (1 / a);

  Cn = (Cn - Zb) / Qn;
  Ce = Ce / Qn;

  let lon;
  let lat;

  if (Math.abs(Ce) <= 2.623395162778) {
    const tmp = clens_cmplx(utg, 2 * Cn, 2 * Ce);

    Cn = Cn + tmp[0];
    Ce = Ce + tmp[1];
    Ce = Math.atan(sinh(Ce));

    const sin_Cn = Math.sin(Cn);
    const cos_Cn = Math.cos(Cn);
    const sin_Ce = Math.sin(Ce);
    const cos_Ce = Math.cos(Ce);

    Cn = Math.atan2(sin_Cn * cos_Ce, hypot(sin_Ce, cos_Ce * cos_Cn));
    Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);

    lon = adjust_lon(Ce + long0);
    lat = gatg(cgb, Cn);
  } else {
    lon = Infinity;
    lat = Infinity;
  }

  p.x = lon;
  p.y = lat;

  return p;
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/sign.js
function sign(x) {
  return x < 0 ? -1 : 1;
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/cosh.js
function cosh(x) {
  let r = Math.exp(x);
  r = (r + 1 / r) / 2;
  return r;
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/clens.js
function clens(pp, arg_r) {
  const r = 2 * Math.cos(arg_r);
  let i = pp.length - 1;
  let hr1 = pp[i];
  let hr2 = 0;
  let hr;

  while (--i >= 0) {
    hr = -hr2 + r * hr1 + pp[i];
    hr2 = hr1;
    hr1 = hr;
  }

  return Math.sin(arg_r) * hr;
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/adjust_lon.js
function adjust_lon(x) {
  return Math.abs(x) <= SPI ? x : x - sign(x) * TWO_PI;
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/hypot.js
function hypot(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  const a = Math.max(x, y);
  const b = Math.min(x, y) / (a ? a : 1);

  return a * Math.sqrt(1 + Math.pow(b, 2));
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/sinh.js
function sinh(x) {
  let r = Math.exp(x);
  r = (r - 1 / r) / 2;
  return r;
}

// https://github.com/proj4js/proj4js/blob/master/lib/common/clens_cmplx.js
function clens_cmplx(pp, arg_r, arg_i) {
  const sin_arg_r = Math.sin(arg_r);
  const cos_arg_r = Math.cos(arg_r);
  const sinh_arg_i = sinh(arg_i);
  const cosh_arg_i = cosh(arg_i);
  let r = 2 * cos_arg_r * cosh_arg_i;
  let i = -2 * sin_arg_r * sinh_arg_i;
  let j = pp.length - 1;
  let hr = pp[j];
  let hi1 = 0;
  let hr1 = 0;
  let hi = 0;
  let hr2;
  let hi2;

  while (--j >= 0) {
    hr2 = hr1;
    hi2 = hi1;
    hr1 = hr;
    hi1 = hi;
    hr = -hr2 + r * hr1 - i * hi1 + pp[j];
    hi = -hi2 + i * hr1 + r * hi1;
  }

  r = sin_arg_r * cosh_arg_i;
  i = cos_arg_r * sinh_arg_i;

  return [r * hr - i * hi, r * hi + i * hr];
}
