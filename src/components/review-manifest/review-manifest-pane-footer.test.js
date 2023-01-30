import { fireEvent, render, screen } from '@testing-library/react';
import { saveAs } from 'file-saver';

import { useReviewManifestStore } from 'common/store/review-manifest.store';
import ReviewManifestPaneFooter, { filename } from './review-manifest-pane-footer';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

describe('ReviewManifestPane Footer', () => {
  it('should render review manifest pane footer', () => {
    const view = render(<ReviewManifestPaneFooter />);
    expect(view).toMatchSnapshot();
  });

  it('should close the pane when cancel button is clicked', () => {
    const state = useReviewManifestStore.getState();
    const spy = jest.spyOn(state, 'hidePane');
    render(<ReviewManifestPaneFooter />);
    const cancelBtn = screen.getByText('cancel');
    fireEvent.click(cancelBtn);
    expect(spy).toHaveBeenCalled();
  });

  it('should save file when download button is clicked', () => {
    render(<ReviewManifestPaneFooter />);
    const cancelBtn = screen.getByText('download');
    fireEvent.click(cancelBtn);
    expect(saveAs).toHaveBeenCalledWith(new Blob(), filename);
  });
});