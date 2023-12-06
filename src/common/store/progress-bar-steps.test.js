import { renderHook } from '@testing-library/react';
import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';
import { useCompletedSteps } from './progress-bar-steps';
import { useReviewManifestStore } from './review-manifest.store';

describe('progress-bar-steps hook', () => {
  beforeEach(() => {
    useLevelsStore.setState({
      levels: [],
    });
    useGeometryStore.setState({
      dwgLayers: [],
    });
    useLayersStore.setState({
      visited: false,
    });
    useReviewManifestStore.setState({
      manifestReviewed: false,
    });
  });

  it('should be empty by default', () => {
    const { result } = renderHook(() => useCompletedSteps());
    expect(result.current).toStrictEqual([]);
  });

  it('should contain georeference', () => {
    useGeometryStore.setState({
      dwgLayers: ['layer123'],
    });
    const { result } = renderHook(() => useCompletedSteps());
    expect(result.current).toStrictEqual(['createGeoreference']);
  });

  it('should contain reviewCreate', () => {
    useReviewManifestStore.setState({
      manifestReviewed: true,
    });
    const { result } = renderHook(() => useCompletedSteps());
    expect(result.current).toStrictEqual(['reviewCreate']);
  });

  it('should not contain levels when some ordinals are null or not unique', () => {
    useLevelsStore.getState().levels = [
      {
        filename: 'file1',
        levelName: 'lvl1',
        ordinal: '1',
        verticalExtent: '',
      },
      {
        filename: 'file2',
        levelName: 'lvl2',
        ordinal: null,
        verticalExtent: '',
      },
      {
        filename: 'file3',
        levelName: 'lvl3',
        ordinal: '3',
        verticalExtent: '',
      },
    ];

    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[1].ordinal = '1';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[1].ordinal = '2';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual(['levels']);
  });

  it('should not contain levels when some level names are empty or have a name longer than 100 chars', () => {
    useLevelsStore.getState().levels = [
      {
        filename: 'file1',
        levelName: '',
        ordinal: '1',
        verticalExtent: '',
      },
      {
        filename: 'file2',
        levelName: 'lvl2',
        ordinal: '2',
        verticalExtent: '',
      },
      {
        filename: 'file3',
        levelName: 'lvl3',
        ordinal: '3',
        verticalExtent: '',
      },
    ];

    const longName =
      'asdjfhgaskdjfhgaskdjfghaskjdfhgaskjdhgfkajshdgfkajshdgfkasjhdfgaksjhdfgaskjdhfgaksjdhfgaksjhdgfaksjhd';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].levelName = longName;
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].levelName = 'lvl1';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual(['levels']);
  });

  it('should not contain levels when vertical extent is invalid', () => {
    useLevelsStore.getState().levels = [
      {
        filename: 'file1',
        levelName: 'lvl1',
        ordinal: '1',
        verticalExtent: '-0.1',
      },
      {
        filename: 'file2',
        levelName: 'lvl2',
        ordinal: '2',
        verticalExtent: '',
      },
      {
        filename: 'file3',
        levelName: 'lvl3',
        ordinal: '3',
        verticalExtent: '50',
      },
    ];

    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].verticalExtent = '100.000000001';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].verticalExtent = '1O0';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].verticalExtent = NaN;
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].verticalExtent = '100';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual(['levels']);
  });

  it('should contain layers', () => {
    useLayersStore.setState({
      visited: true,
    });
    const { result } = renderHook(() => useCompletedSteps());
    expect(result.current).toStrictEqual(['layers']);
  });
});
