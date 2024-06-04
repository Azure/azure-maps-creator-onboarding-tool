import getPaletteAsRawColors from './theme';

export const defaultFillColor = getPaletteAsRawColors().placesOffice;

export const categoryToFillColor = new Map([
  ['room', getPaletteAsRawColors().placesOffice],
  ['conferenceroom', getPaletteAsRawColors().placesCyanTint50],
  ['workspace', getPaletteAsRawColors().places160],
  ['walkway', getPaletteAsRawColors().placesWalkway],
  ['elevator', getPaletteAsRawColors().white],
  ['stairs', getPaletteAsRawColors().white],
  ['restroom', getPaletteAsRawColors().placesBlueTint50],
  ['restroom.male', getPaletteAsRawColors().placesBlueTint50],
  ['restroom.female', getPaletteAsRawColors().placesBlueTint50],
  ['restroom.unisex', getPaletteAsRawColors().placesBlueTint50],
]);

export const categoryToIconColor = new Map([
  ['conferenceroom', getPaletteAsRawColors().placesNeutralForeground2],
  ['workspace', getPaletteAsRawColors().placesNeutralForeground2],
  ['elevator', getPaletteAsRawColors().placesNeutralForeground2],
  ['stairs', getPaletteAsRawColors().placesNeutralForeground2],
  ['restroom', getPaletteAsRawColors().placesBluePrimary],
  ['restroom.male', getPaletteAsRawColors().placesBluePrimary],
  ['restroom.female', getPaletteAsRawColors().placesBluePrimary],
  ['restroom.unisex', getPaletteAsRawColors().placesBluePrimary],
]);

export const unitStyles = {
  lineColor: getPaletteAsRawColors().placesWall,
  lineWidth: 1,
};

export const levelStyles = {
  lineColor: getPaletteAsRawColors().placesWall,
  lineWidth: 3,
};

const defaultIconMinZoom = 17;
const textMinZoom = 19.8;

export const defaultIconStyles = {
  size: 1,
  minZoom: defaultIconMinZoom,
};

export const categoryToDefaultImageKey = new Map([
  ['restroom', 'restroom'],
  ['restroom.male', 'restroom'],
  ['restroom.female', 'restroom'],
  ['restroom.unisex', 'restroom'],
  ['elevator', 'elevator'],
  ['stairs', 'stairs'],
  ['conferenceroom', 'conferenceRoom'],
  ['workspace', 'deskpool'],
]);

export const textStyles = {
  minZoom: textMinZoom,
  size: 12,
  haloWidth: 1,
  haloColor: getPaletteAsRawColors().white,
};

export function getIconStylesByCategory(category) {
  if (categoryToIconColor.has(category)) {
    return {
      ...defaultIconStyles,
      color: categoryToIconColor.get(category),
    };
  } else {
    return defaultIconStyles;
  }
}
