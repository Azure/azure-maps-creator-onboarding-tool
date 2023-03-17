import { shallow } from 'zustand/shallow';
import { create } from 'zustand';

import { PATHS } from '../constants';
import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';

export const progressBarStepsByKey = {
    createGeoreference: 'createGeoreference',
    layers: 'layers',
    levels: 'levels',
};
export const progressBarSteps = [
    {
        key: progressBarStepsByKey.levels,
        name: 'facility.levels',
        href: PATHS.LEVELS,
    },
    {
        key: progressBarStepsByKey.layers,
        name: 'dwg.layers',
        href: PATHS.LAYERS,
    },
    {
        key: progressBarStepsByKey.createGeoreference,
        name: 'georeference',
        href: PATHS.CREATE_GEOREFERENCE,
    },
];

export const useProgressBarStore = create((set) => ({
    isMissingDataErrorShown: false,
    isIncorrectManifestVersionErrorShown: false,
    isInvalidManifestErrorShown: false,
    showIncorrectManifestVersionError: () => set({
        isIncorrectManifestVersionErrorShown: true,
    }),
    hideIncorrectManifestVersionError: () => set({
        isIncorrectManifestVersionErrorShown: false,
    }),
    showInvalidManifestError: () => set({
        isInvalidManifestErrorShown: true,
    }),
    hideInvalidManifestError: () => set({
        isInvalidManifestErrorShown: false,
    }),
    showMissingDataError: () => set({
        isMissingDataErrorShown: true,
    }),
    hideMissingDataError: () => set({
        isMissingDataErrorShown: false,
    }),
}));

const geometrySelector = s => s.dwgLayers;
const levelsSelector = s => [s.allLevelsCompleted, s.levels, s.facilityName, s.isLevelNameValid];
const layersSelector = s => [s.allLayersValid, s.layers, s.visited];

export const useCompletedSteps = () => {
    const dwgLayers = useGeometryStore(geometrySelector);
    const [allLayersValid, layers, layersPageVisited] = useLayersStore(layersSelector);
    const [allLevelsCompleted, levels, facilityName, isLevelNameValid] = useLevelsStore(levelsSelector, shallow);

    const completedSteps = [];

    if (dwgLayers.length > 0) {
        completedSteps.push(progressBarStepsByKey.createGeoreference);
    }
    if (layersPageVisited && allLayersValid(layers)) {
        completedSteps.push(progressBarStepsByKey.layers);
    }
    if (allLevelsCompleted(levels) && isLevelNameValid(facilityName)) {
        completedSteps.push(progressBarStepsByKey.levels);
    }

    return completedSteps;
};