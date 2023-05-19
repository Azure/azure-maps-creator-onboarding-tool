import { render } from '@testing-library/react';

import UploadContent from './upload-content';

jest.mock('common/store', () => ({
  useConversionStore: () => ['operation log here', 'some-upload-id-hello', 'super-operation-id'],
}));

describe('conversion upload content', () => {
  it('should render upload content', () => {
    const view = render(<UploadContent selected />);
    expect(view).toMatchSnapshot();
  });

  it('should render nothing when selected is not set', () => {
    const view = render(<UploadContent />);
    expect(view).toMatchSnapshot();
  });
});