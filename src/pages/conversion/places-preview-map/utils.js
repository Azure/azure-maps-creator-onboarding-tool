import * as zip from '@zip.js/zip.js';
import conferenceRoom from './assets/conferenceroom.svg';
import deskpool from './assets/deskpool.svg';
import elevator from './assets/elevator.svg';
import restroom from './assets/restroom.svg';
import stairs from './assets/stairs.svg';
import { categoryToFillColor, defaultFillColor, levelStyles, textStyles, unitStyles } from './theme/floorPlanStyles';

export function getFillStyles(featureType, category) {
  if (featureType !== 'unit') {
    return {};
  }

  var fillStyle = {
    fillColor: categoryToFillColor.has(category) ? categoryToFillColor.get(category) : defaultFillColor,
    fillOpacity: 1,
  };

  return fillStyle;
}

export function getLineStyles(featureType, category) {
  var paintStyle = {
    strokeColor: 'transparent',
  };

  // Do not add line styles to walkways since otherwise it will block
  // the outlines for the units
  if (featureType === 'unit' && category !== 'walkway') {
    paintStyle = {
      strokeColor: unitStyles.lineColor,
      strokeWidth: unitStyles.lineWidth,
      lineJoin: 'round',
      lineCap: 'round',
    };
  }

  if (featureType === 'level') {
    paintStyle = {
      strokeColor: levelStyles.lineColor,
      strokeWidth: levelStyles.lineWidth,
      lineJoin: 'round',
      lineCap: 'round',
    };
  }

  return paintStyle;
}

export const imageSprites = [
  {
    id: 'restroom',
    icon: restroom,
    templateName: 'triangle-arrow-up',
  },
  {
    id: 'stairs',
    icon: stairs,
    templateName: 'triangle-arrow-up',
  },
  {
    id: 'elevator',
    icon: elevator,
    templateName: 'triangle-arrow-up',
  },
  {
    id: 'conferenceRoom',
    icon: conferenceRoom,
    templateName: 'triangle-arrow-up',
  },
  {
    id: 'deskpool',
    icon: deskpool,
    templateName: 'triangle-arrow-up',
  },
];

export function getTextStyle(category) {
  const hasImage = imageSprites.findIndex(item => item.id === category) >= 0;

  const style = {
    textOptions: {
      textField: ['get', 'label'],
      size: textStyles.size,
      font: ['SegoeUi-Regular'],
      anchor: hasImage ? 'top' : 'center',
      offset: hasImage ? [0, 1] : [0, 0], // positive value indicates right and down
      allowOverlap: false,
      haloWidth: textStyles.haloWidth,
      haloColor: textStyles.haloColor,
    },
    iconOptions: {
      image: hasImage ? category : 'none',
      size: 0.9,
      anchor: 'center',
      allowOverlap: false,
    },
    minZoom: textStyles.minZoom,
  };

  return style;
}

function isValidLatitude(lat) {
  return lat >= -90 && lat <= 90;
}

function isValidLongitude(lon) {
  return lon >= -180 && lon <= 180;
}

export function calculateBoundingBox(levels) {
  let minLat = 90;
  let maxLat = -90;
  let minLon = 180;
  let maxLon = -180;
  let hasCalculated = false;

  levels.features.forEach(feature => {
    const { coordinates } = feature.geometry;

    coordinates[0].forEach(([lon, lat]) => {
      if (!isValidLongitude(lon) || !isValidLatitude(lat)) return;

      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      hasCalculated = true;
    });
  });

  if (!hasCalculated) return undefined;

  return [minLon, minLat, maxLon, maxLat];
}

export async function fetchZip(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  const blob = await response.blob(); // Get a Blob from the response
  return blob;
}

export async function unzipBlob(blob) {
  const reader = new zip.ZipReader(new zip.BlobReader(blob));
  const entries = await reader.getEntries(); // Get all ZIP entries (files)
  if (entries.length === 0) {
    throw new Error('The ZIP file is empty');
  }
  return entries;
}

async function readEntries(entries) {
  const files = await Promise.all(
    entries.map(async entry => {
      if (!entry.directory) {
        const content = await entry.getData(new zip.TextWriter(), {
          onprogress: (progress, total) => {},
        });
        return { filename: entry.filename, content: JSON.parse(content) };
      }
      return null;
    })
  );

  return files.filter(Boolean); // Filter out null values (directories)
}

export async function processZip(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const blob = await fetchZip(url);
      const entries = await unzipBlob(blob);
      const files = await readEntries(entries);

      resolve(files);
    } catch (error) {
      console.error('Error processing ZIP file:', error);
      reject(error);
    }
  });
}

export const getFeatureLabel = (feature, language) => {
  return feature?.properties?.name?.[language];
};
