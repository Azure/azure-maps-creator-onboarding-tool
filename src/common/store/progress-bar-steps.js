import { shallow } from'zustand/shallow';
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
        name: 'building.levels',
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
    isErrorShown: false,
    showError: () => set({
        isErrorShown: true,
    }),
    hideError: () => set({
        isErrorShown: false,
    }),
}));

const geometrySelector = s => s.checkedByUser;
const levelsSelector = s => [s.allLevelsCompleted, s.levels];
const layersSelector = s => [s.allLayersValid, s.layers];

export const useCompletedSteps = () => {
    const georeferenceCheckedByUser = useGeometryStore(geometrySelector);
    const [allLayersValid, layers] = useLayersStore(layersSelector);
    const [allLevelsCompleted, levels] = useLevelsStore(levelsSelector, shallow);

    const completedSteps = [];

    if (georeferenceCheckedByUser) {
        completedSteps.push(progressBarStepsByKey.createGeoreference);
    }
    if (allLayersValid(layers)) {
        completedSteps.push(progressBarStepsByKey.layers);
    }
    if (allLevelsCompleted(levels)) {
        completedSteps.push(progressBarStepsByKey.levels);
    }

    return completedSteps;
};