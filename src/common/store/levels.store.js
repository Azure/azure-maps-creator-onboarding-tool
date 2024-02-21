import { PLACES_PREVIEW } from 'common/constants';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { isNumeric, isVerticalExtentEmpty } from '../functions';

const MAX_LEVEL_NAME_LENGTH = 100;

const getDefaultState = () => ({
  facilityName: '',
  levels: [],
  language: PLACES_PREVIEW.DEFAULT_LANGUAGE,
});

export const useLevelsStore = createWithEqualityFn(
  (set, get) => ({
    ...getDefaultState(),
    reset: () =>
      set({
        ...getDefaultState(),
      }),
    setFacilityName: (facilityName = '') =>
      set({
        facilityName,
      }),
    setLanguage: (language = PLACES_PREVIEW.DEFAULT_LANGUAGE) => {
      set({
        language,
      });
    },
    setLevels: filenames =>
      set({
        levels: filenames.map(filename => ({
          filename,
          levelName: '',
          ordinal: '',
          verticalExtent: '',
        })),
      }),
    updateLevels: (levels = []) => {
      const levelsByFilename = levels
        .filter(level => typeof level === 'object' && level !== null)
        .reduce(
          (acc, val) => ({
            ...acc,
            [val.filename]: val,
          }),
          {}
        );

      set(state => ({
        levels: state.levels.map(level => {
          if (levelsByFilename[level.filename] === undefined) {
            return level;
          }
          return {
            filename: level.filename,
            levelName:
              typeof levelsByFilename[level.filename].levelName === 'string'
                ? levelsByFilename[level.filename].levelName
                : level.levelName,
            ordinal:
              typeof levelsByFilename[level.filename].ordinal === 'number'
                ? levelsByFilename[level.filename].ordinal.toString()
                : level.ordinal,
            verticalExtent:
              typeof levelsByFilename[level.filename].verticalExtent === 'number'
                ? levelsByFilename[level.filename].verticalExtent.toString()
                : level.verticalExtent,
          };
        }),
      }));
    },
    setOrdinal: (filename, ordinal) =>
      set(state => ({
        levels: state.levels.map(level => {
          if (level.filename !== filename) {
            return level;
          }
          return {
            ...level,
            ordinal,
          };
        }),
      })),
    setLevelName: (filename, levelName) =>
      set(state => ({
        levels: state.levels.map(level => {
          if (level.filename !== filename) {
            return level;
          }
          return {
            ...level,
            levelName,
          };
        }),
      })),
    setVerticalExtent: (filename, verticalExtent) =>
      set(state => ({
        levels: state.levels.map(level => {
          if (level.filename !== filename) {
            return level;
          }
          return {
            ...level,
            verticalExtent,
          };
        }),
      })),
    getVerticalExtentError: verticalExtent => {
      if (isVerticalExtentEmpty(verticalExtent)) {
        return null;
      }
      if (isNumeric(verticalExtent)) {
        const verticalExtentNumber = parseFloat(verticalExtent);
        if (verticalExtentNumber > 0 && verticalExtentNumber <= 100) {
          return null;
        }
      }
      return 'error.vertical.extent.not.valid';
    },
    getOrdinalError: ordinal => {
      if (get().isOrdinalEmpty(ordinal)) {
        return null;
      }
      if (!get().isOrdinalValid(ordinal)) {
        return 'error.ordinal.not.valid';
      }
      if (!get().isOrdinalUnique(ordinal)) {
        return 'error.ordinal.must.be.unique';
      }
      return null;
    },
    isOrdinalEmpty: ordinal => {
      return ordinal === '' || ordinal === '-';
    },
    isOrdinalValid: ordinal => {
      const int = parseInt(ordinal);

      if (int.toString() !== ordinal) {
        return false;
      }
      return int >= -1000 && int <= 1000;
    },
    isOrdinalUnique: ordinal => {
      const levels = get().levels;
      const count = levels.reduce((acc, val) => {
        if (val.ordinal === ordinal) {
          return acc + 1;
        }
        return acc;
      }, 0);

      return count < 2;
    },
    isLevelNameValid: levelName => {
      return levelName.length <= MAX_LEVEL_NAME_LENGTH;
    },
    allLevelsCompleted: levels => {
      if (levels.length === 0) {
        return false;
      }

      const { getOrdinalError, isLevelNameValid, isOrdinalEmpty } = get();
      return levels.every(
        ({ levelName, ordinal }) =>
          levelName.replace(/\s/g, '') !== '' &&
          isLevelNameValid(levelName) &&
          !isOrdinalEmpty(ordinal) &&
          getOrdinalError(ordinal) === null
      );
    },
  }),
  shallow
);
