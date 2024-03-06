import { act, renderHook } from '@testing-library/react';
import { PLACES_PREVIEW } from 'common/constants';
import * as featureFlagsHook from 'hooks/useFeatureFlags';
import * as reactRouterDom from 'react-router-dom';
import useCustomNavigate from './index';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('hooks/useFeatureFlags', () => jest.fn());

describe('useCustomNavigate', () => {
  it('returns a function', () => {
    reactRouterDom.useNavigate.mockImplementation(() => jest.fn());
    featureFlagsHook.default.mockImplementation(() => ({ isPlacesPreview: false }));

    const { result } = renderHook(() => useCustomNavigate());
    expect(typeof result.current).toBe('function');
  });

  it('appends placespreview to the query params if feature flag is enabled', () => {
    const mockNavigate = jest.fn();
    reactRouterDom.useNavigate.mockImplementation(() => mockNavigate);
    featureFlagsHook.default.mockImplementation(() => ({ isPlacesPreview: true }));

    const { result } = renderHook(() => useCustomNavigate());

    act(() => {
      result.current('/path');
    });

    expect(mockNavigate).toHaveBeenCalledWith(`/path?${PLACES_PREVIEW.SEARCH_PARAMETER}=true`, undefined);
  });

  it('does not append placespreview to the query params if feature flag is disabled', () => {
    const mockNavigate = jest.fn();
    reactRouterDom.useNavigate.mockImplementation(() => mockNavigate);
    featureFlagsHook.default.mockImplementation(() => ({ isPlacesPreview: false }));

    const { result } = renderHook(() => useCustomNavigate());

    act(() => {
      result.current('/path');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/path?', undefined);
  });
});
