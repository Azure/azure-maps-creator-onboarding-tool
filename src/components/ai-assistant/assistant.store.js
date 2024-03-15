import { useGeometryStore, useLayersStore } from 'common/store';
import toast from 'react-hot-toast';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { fetchSuggestionsFromAPI } from './api';
import { AiConfig } from './config';
import { mockData } from './mock-response';

export const useAssistantStore = createWithEqualityFn(
  (set, get) => ({
    ...getDefaultState(),
    reset: () =>
      set({
        ...getDefaultState(),
      }),
    toggleAssistant: newState => {
      set(state => ({
        assistantEnabled: newState ?? !state.assistantEnabled,
      }));
    },
    setClasses: classes => {
      set({
        classes,
      });
    },
    suggestExterior: () => {
      const suggestedExterior =
        get().fetchedData?.layerMappings.find(item => item.featureClass === AiConfig.exteriorLayerName)?.layers ?? [];

      // Apply suggestion
      useGeometryStore.getState().setDwgLayers(suggestedExterior);
      toast.success('Suggested exterior layers applied', { position: 'top-center' });

      // Save suggestion
      set({
        exteriorLayers: suggestedExterior,
      });
    },
    suggestLayers: () => {
      const suggestedFeatureClasses = get()
        .fetchedData?.layerMappings.filter(item => item.featureClass !== AiConfig.exteriorLayerName)
        .map(item => ({
          featureClassName: item.featureClass,
          dwgLayers: item.layers,
          featureClassProperties: [],
        }));

      // Apply suggestion
      useLayersStore.getState().setLayerFromManifestJson(suggestedFeatureClasses);
      toast.success('Suggested feature classes applied', { position: 'top-center' });

      set({
        layers: suggestedFeatureClasses,
      });
    },
    fetchSuggestions: async geojson => {
      console.log(geojson);

      if (!get().assistantEnabled) {
        console.log('Assistant is disabled, skipping fetchSuggestions');
        return;
      }

      console.log('Assistant is enabled, fetching suggestions');

      set({
        loading: true,
      });

      try {
        let res = null;
        if (AiConfig.useMockData) {
          res = mockData;
          // Simulate loading
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          const classes = get().classes;
          const rawRes = await fetchSuggestionsFromAPI(geojson, classes);
          res = await rawRes.json();
        }

        console.log('Assistant suggestions fetched', res);

        set({
          fetchedData: res,
          layerDescriptions: res.layerDescriptions.sort((a, b) => a.layerName.localeCompare(b.layerName)),
          loading: false,
        });
      } catch (e) {
        console.log('Error fetching AI API data', e);
      }
    },
  }),
  shallow
);

export const useSuggestedExteriorLayers = () => {
  const [enabled, layers] = useAssistantStore(state => [state.assistantEnabled, state.exteriorLayers]);

  if (!enabled) return [];
  return layers;
};

export const useSuggestedLayers = featureClassName => {
  const [enabled, suggestedFeatureClasses] = useAssistantStore(state => [state.assistantEnabled, state.layers]);

  if (!enabled) return [];

  const foundObj = suggestedFeatureClasses.find(item => item.featureClassName === featureClassName);
  const layers = foundObj?.dwgLayers ?? [];

  return layers;
};

export function getDefaultState() {
  return {
    loading: false,
    classes: [
      AiConfig.exteriorLayerName,
      'rooms',
      'walls',
      'elevator',
      'stairs',
      'glass',
      'windows',
      'sills',
      'shelves',
    ],
    fetchedData: null,
    layerDescriptions: [],
    assistantEnabled: true,
    exteriorLayers: [],
    layers: [],
  };
}
