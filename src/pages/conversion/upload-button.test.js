import { render } from '@testing-library/react';

import UploadButton from './upload-button';

describe('conversion upload button', () => {
  it('should render upload button', () => {
    const view = render(<UploadButton />);
    expect(view).toMatchSnapshot();
  });

  it('should render upload button with selected class', () => {
    const view = render(<UploadButton selected />);
    expect(view).toMatchSnapshot();
  });
});