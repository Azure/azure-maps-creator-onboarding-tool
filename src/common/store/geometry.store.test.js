import { renderHook } from '@testing-library/react-hooks';

import { expectedUseDissolvedExteriorResult, mockPolygonLayers } from './geometry.store.mock';
import { useDissolvedExterior, fixAngle, useGeometryStore, isValidAnchorPoint } from './geometry.store';
import { useLayersStore } from './layers.store';

describe('useDissolvedExterior', () => {
  it('should return hook data', () => {
    useLayersStore.setState({
      polygonLayers: mockPolygonLayers,
    });
    useGeometryStore.setState({
      dwgLayers: ['WALLS'],
    });
    const { result } = renderHook(() => useDissolvedExterior());
    expect(result.current).toEqual(expectedUseDissolvedExteriorResult);
  });

  it('should return null when no exterior layers selected', () => {
    useLayersStore.setState({
      polygonLayers: mockPolygonLayers,
    });
    useGeometryStore.setState({
      dwgLayers: [],
    });
    const { result } = renderHook(() => useDissolvedExterior());
    expect(result.current).toEqual([null, null]);
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
    expect(fixAngle(50000)).toBe(320);
    expect(fixAngle(719)).toBe(359);
    expect(fixAngle(500)).toBe(140);
    expect(fixAngle(400)).toBe(40);
    expect(fixAngle(360)).toBe(360);
    expect(fixAngle(359)).toBe(359);
    expect(fixAngle(270)).toBe(270);
    expect(fixAngle(180)).toBe(180);
    expect(fixAngle(90)).toBe(90);
    expect(fixAngle(1)).toBe(1);
  });
});

describe('isValidAnchorPoint', () => {
  it('should return true', () => {
    expect(isValidAnchorPoint({ coordinates: [0,0], angle: 0 })).toBe(true);
    expect(isValidAnchorPoint({ coordinates: [-100,-100], angle: -100 })).toBe(true);
    expect(isValidAnchorPoint({ coordinates: [100,100], angle: 100 })).toBe(true);
  });

  it('should return false', () => {
    expect(isValidAnchorPoint({ coordinates: [0,0], angle: null })).toBe(false);
    expect(isValidAnchorPoint({ angle: null })).toBe(false);
    expect(isValidAnchorPoint({ coordinates: [0,0] })).toBe(false);
    expect(isValidAnchorPoint({ coordinates: [0,0], angle: true })).toBe(false);
    expect(isValidAnchorPoint({ coordinates: [0,0], angle: Infinity })).toBe(false);
    expect(isValidAnchorPoint({ coordinates: [0,0], angle: NaN })).toBe(false);
    expect(isValidAnchorPoint({ coordinates: [NaN,0], angle: 0 })).toBe(false);
    expect(isValidAnchorPoint({ coordinates: [0,NaN], angle: 0 })).toBe(false);
  });
});