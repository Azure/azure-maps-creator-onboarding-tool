import { renderHook } from '@testing-library/react-hooks';

import { expectedUseDissolvedExteriorResult, mockPolygonLayers } from './geometry.store.mock';
import { useDissolvedExterior, fixAngle } from './geometry.store';
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

describe('fixAngle', () => {
  it('should return 360', () => {
    expect(fixAngle(-360)).toBe(360);
    expect(fixAngle(0)).toBe(360);
  });

  it('should add 360', () => {
    expect(fixAngle(-359)).toBe(1);
    expect(fixAngle(-270)).toBe(90);
    expect(fixAngle(-180)).toBe(180);
    expect(fixAngle(-90)).toBe(270);
    expect(fixAngle(-1)).toBe(359);
  });

  it('should return as is', () => {
    expect(fixAngle(50000)).toBe(50000);
    expect(fixAngle(360)).toBe(360);
    expect(fixAngle(359)).toBe(359);
    expect(fixAngle(270)).toBe(270);
    expect(fixAngle(180)).toBe(180);
    expect(fixAngle(90)).toBe(90);
    expect(fixAngle(1)).toBe(1);
  });
});