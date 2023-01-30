import { render } from '@testing-library/react';

import ReviewManifest from './review-manifest';
import { useReviewManifestStore } from 'common/store/review-manifest.store';

jest.mock('./review-manifest-pane', () => () => <div>This is review manifest pane</div>);

describe('ReviewManifest', () => {
  it('should not render anything when isPaneShown is false', () => {
    const view = render(<ReviewManifest />);
    expect(view).toMatchSnapshot();
  });

  it('should render review manifest pane when isPaneShown is true', () => {
    useReviewManifestStore.setState({
      isPaneShown: true,
    });

    const view = render(<ReviewManifest />);
    expect(view).toMatchSnapshot();
  });
});