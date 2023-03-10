import { renderHook } from '@testing-library/react-hooks';

import { useCompletedSteps } from './progress-bar-steps';
import { useGeometryStore } from './geometry.store';
import { useLayersStore } from './layers.store';
import { useLevelsStore } from './levels.store';

describe('progress-bar-steps hook', () => {
  beforeEach(() => {
    useLevelsStore.getState().levels = [];
    useGeometryStore.setState({
      checkedByUser: false,
    });
    useLayersStore.setState({
      layers: [{
        id: 0,
        name: 'exterior',
        value: [],
        props: [],
        required: true,
        isDraft: false,
      }],
    });
  });

  it('should be empty by default', () => {
    const { result } = renderHook(() => useCompletedSteps());
    expect(result.current).toStrictEqual([]);
  });

  it('should contain georeference', () => {
    useGeometryStore.setState({
      checkedByUser: true,
    });
    const { result } = renderHook(() => useCompletedSteps());
    expect(result.current).toStrictEqual(['createGeoreference']);
  });

  it('should not contain levels when some ordinals are null or not unique', () => {
    useLevelsStore.getState().levels = [
      {
        filename: 'file1',
        levelName: 'lvl1',
        ordinal: '1',
      },
      {
        filename: 'file2',
        levelName: 'lvl2',
        ordinal: null,
      },
      {
        filename: 'file3',
        levelName: 'lvl3',
        ordinal: '3',
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
      },
      {
        filename: 'file2',
        levelName: 'lvl2',
        ordinal: '2',
      },
      {
        filename: 'file3',
        levelName: 'lvl3',
        ordinal: '3',
      },
    ];

    const longName = 'asdjfhgaskdjfhgaskdjfghaskjdfhgaskjdhgfkajshdgfkajshdgfkasjhdfgaksjhdfgaskjdhfgaksjdhfgaksjhdgfaksjhd';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].levelName = longName;
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual([]);
    useLevelsStore.getState().levels[0].levelName = 'lvl1';
    expect(renderHook(() => useCompletedSteps()).result.current).toStrictEqual(['levels']);
  });

  it('should contain layers', () => {
    useLayersStore.setState({
      layers: [{
        id: 0,
        name: 'exterior',
        value: ['someVal'],
        props: [],
        required: true,
        isDraft: false,
      }],
    });
    const { result } = renderHook(() => useCompletedSteps());
    expect(result.current).toStrictEqual(['layers']);
  });
});