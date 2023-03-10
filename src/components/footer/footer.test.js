import { fireEvent, render, screen } from '@testing-library/react';

import { useReviewManifestStore } from 'common/store/review-manifest.store';
import { useGeometryStore } from 'common/store/geometry.store';
import { useLayersStore } from 'common/store/layers.store';
import { useLevelsStore } from 'common/store/levels.store';
import Footer from './footer';

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
    useLayersStore.setState({ layers: [{ id: 0, value: ['OUTLINE'] }] });
    useLevelsStore.setState({ levels: [{ levelName: '1', ordinal: 1 }]});    const view = render(<Footer />);
    expect(view).toMatchSnapshot();
  });

  it('should navigate to next page when next button is clicked', () => {
    mockCurrentPathname = '/layers';
    useLayersStore.setState({ layers: [{ id: 0, value: ['OUTLINE'] }] });
    render(<Footer />);
    const nextBtn = screen.getByText('next');
    fireEvent.click(nextBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/create-georeference');
  });

  it('should navigate to prev page when prev button is clicked', () => {
    mockCurrentPathname = '/layers';
    render(<Footer />);
    const prevBtn = screen.getByText('previous');
    fireEvent.click(prevBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/levels');
  });

  it('show open review manifest pane when review button is clicked', () => {
    const state = useReviewManifestStore.getState();
    const spy = jest.spyOn(state, 'showPane');
    useGeometryStore.setState({ checkedByUser: true });
    useLayersStore.setState({ layers: [{ id: 0, name: 'exterior', value: ['OUTLINE'], props: [] }] });
    useLevelsStore.setState({ levels: [{ levelName: '1', ordinal: '1' }]});

    render(<Footer />);
    const reviewBtn = screen.getByText('review.download');
    fireEvent.click(reviewBtn);
    expect(spy).toHaveBeenCalled();
  });
});