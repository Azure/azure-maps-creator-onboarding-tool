import { renderHook } from '@testing-library/react-hooks';

import { expectedUseDissolvedExteriorResult, mockPolygonLayers } from './geometry.store.mock';
import { useDissolvedExterior } from './geometry.store';
import { useLayersStore } from './layers.store';

describe('useDissolvedExterior', () => {
  it('should return hook data', () => {
    useLayersStore.setState({
      polygonLayers: mockPolygonLayers,
      layers: [{ id: 0, value: ['OUTLINE'] }],
    });
    const { result } = renderHook(() => useDissolvedExterior());
    expect(result.current).toEqual(expectedUseDissolvedExteriorResult);
  });

  it('should return null when no exterior layers selected', () => {
    useLayersStore.setState({
      polygonLayers: mockPolygonLayers,
      layers: [{ id: 0, value: [] }],
    });
    const { result } = renderHook(() => useDissolvedExterior());
    expect(result.current).toEqual([null, null, null]);
  });
});