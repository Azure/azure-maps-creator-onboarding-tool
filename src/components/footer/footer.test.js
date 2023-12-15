import { fireEvent, render, screen } from '@testing-library/react';
import { saveAs } from 'file-saver';
import flushPromises from 'flush-promises';

import featureFlags from 'common/feature-flags';
import {
  useConversionStore,
  useGeometryStore,
  useLayersStore,
  useLevelsStore,
  useReviewManifestStore,
} from 'common/store';
import Footer from './footer';

const mockNavigate = jest.fn();
let mockCurrentPathname = '/screen1';

jest.mock('hooks', () => ({
  useCustomNavigate: () => mockNavigate,
  useFeatureFlags: () => ({ isPlacesPreview: false }),
}));
jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockCurrentPathname,
  }),
}));
jest.mock('common/feature-flags', () => ({
  onboardingEnabled: true,
}));

describe('footer on pages where it should not be rendered', () => {
  beforeEach(() => {
    mockCurrentPathname = '/a-snail-breathes-through-its-foot';
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render nothing', () => {
    const view = render(<Footer />);
    expect(view).toMatchSnapshot();
  });
});

describe('footer on pages where it should be rendered', () => {
  beforeEach(() => {
    mockCurrentPathname = '/create-georeference';
  });

  it('should render footer with next button disabled', () => {
    const view = render(<Footer />);
    expect(view).toMatchSnapshot();
  });

  it('should render footer with prev button disabled', () => {
    mockCurrentPathname = '/levels';
    useGeometryStore.setState({ checkedByUser: true });
    useLayersStore.setState({ layers: [{ id: 0, value: ['OUTLINE'], props: [] }] });
    useLevelsStore.setState({ levels: [{ levelName: '1', ordinal: 1 }] });
    const view = render(<Footer />);
    expect(view).toMatchSnapshot();
  });

  it('should navigate to next page when next button is clicked', () => {
    mockCurrentPathname = '/layers';
    useLayersStore.setState({ layers: [{ id: 0, value: ['OUTLINE'], props: [] }] });
    render(<Footer />);
    const nextBtn = screen.getByText('next');
    fireEvent.click(nextBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/review-create');
  });

  it('should navigate to prev page when prev button is clicked', () => {
    mockCurrentPathname = '/layers';
    render(<Footer />);
    const prevBtn = screen.getByText('previous');
    fireEvent.click(prevBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/create-georeference');
  });

  it('should navigate to conversion page when create+download is clicked', async () => {
    useReviewManifestStore.setState({
      manifestReviewed: true,
    });
    const conversionState = useConversionStore.getState();
    const resetSpy = jest.spyOn(conversionState, 'reset');
    const uploadPackageSpy = jest.spyOn(conversionState, 'uploadPackage').mockImplementation(() => {});
    useGeometryStore.setState({ dwgLayers: ['layer1'] });
    useLayersStore.setState({ visited: true, layers: [] });
    useLevelsStore.setState({ levels: [{ levelName: '1', ordinal: '1', verticalExtent: '50' }] });

    render(<Footer />);
    const createDownloadBtn = screen.getByText('create.download');
    fireEvent.click(createDownloadBtn);
    await flushPromises();

    expect(resetSpy).toHaveBeenCalled();
    expect(uploadPackageSpy).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/review-create/conversion');
  });

  it('should not navigate to conversion page when onboarding FF is disabled', async () => {
    useReviewManifestStore.setState({
      manifestReviewed: true,
    });
    featureFlags.onboardingEnabled = false;
    const conversionState = useConversionStore.getState();
    const resetSpy = jest.spyOn(conversionState, 'reset');
    const uploadPackageSpy = jest.spyOn(conversionState, 'uploadPackage').mockImplementation(() => {});
    useGeometryStore.setState({ dwgLayers: ['layer1'] });
    useLayersStore.setState({ visited: true, layers: [] });
    useLevelsStore.setState({ levels: [{ levelName: '1', ordinal: '1', verticalExtent: '50' }] });

    render(<Footer />);
    const createDownloadBtn = screen.getByText('download');
    fireEvent.click(createDownloadBtn);
    await flushPromises();

    expect(resetSpy).toHaveBeenCalled();
    expect(uploadPackageSpy).not.toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith('/review-create/conversion');
  });
});
