import { render } from '@testing-library/react';
import Review from './index';

const mockSetCanBeDownloaded = jest.fn();
let mockCompletedSteps = [{}, {}];
jest.mock('hooks', () => ({
  useFeatureFlags: () => ({ isPlacesPreview: false }),
}));

jest.mock('common/store/progress-bar-steps.store', () => ({
  ...jest.requireActual('common/store/progress-bar-steps.store'),
  useCompletedSteps: () => mockCompletedSteps,
}));

jest.mock('common/store/review-manifest.store', () => ({
  useReviewManifestStore: () => mockSetCanBeDownloaded,
  useReviewManifestJson: () => ({ foo: 'bar', hello: 'bye' }),
}));

describe('Review page', () => {
  it('should render page', () => {
    const view = render(<Review />);
    expect(view).toMatchSnapshot();
    expect(mockSetCanBeDownloaded).toHaveBeenCalledWith(true);
  });
});
