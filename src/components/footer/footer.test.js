import { fireEvent, render, screen } from '@testing-library/react';
import { saveAs } from 'file-saver';

import Footer from './footer';
import {
  useGeometryStore,
  useLayersStore,
  useLevelsStore,
  useConversionStore,
  useReviewManifestStore,
} from 'common/store';
import flushPromises from 'flush-promises';

const mockNavigate = jest.fn();
let mockCurrentPathname = '/screen1';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockCurrentPathname,
  }),
  useNavigate: () => mockNavigate,
}));

describe('footer on pages where it should not be rendered', () => {
  beforeEach(() => {
    mockCurrentPathname = '/a-snail-breathes-through-its-foot';
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
    useLevelsStore.setState({ levels: [{ levelName: '1', ordinal: 1 }]});
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

  it('show navigate to conversion page when create+download is clicked', async () => {
    useReviewManifestStore.setState({
      canBeDownloaded: true,
    });
    const conversionState = useConversionStore.getState();
    const resetSpy = jest.spyOn(conversionState, 'reset');
    const uploadPackageSpy = jest.spyOn(conversionState, 'uploadPackage').mockImplementation(() => {});
    useGeometryStore.setState({ dwgLayers: ['layer1'] });
    useLayersStore.setState({ visited: true, layers: [] });
    useLevelsStore.setState({ levels: [{ levelName: '1', ordinal: '1', verticalExtent: '50' }]});

    render(<Footer />);
    const createDownloadBtn = screen.getByText('create.download');
    fireEvent.click(createDownloadBtn);
    await flushPromises();

    expect(resetSpy).toHaveBeenCalled();
    expect(uploadPackageSpy).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalled();
  });
});