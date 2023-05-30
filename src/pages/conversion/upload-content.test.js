import { render } from '@testing-library/react';

import UploadContent from './upload-content';
import { useConversionStore } from 'common/store';

describe('upload content', () => {
  beforeEach(() => {
    useConversionStore.setState({
      selectedStep: 0,
      uploadOperationLog: null,
      uploadOperationId: null,
      uploadUdId: null,
    });
  });

  it('should render nothing when not selected', () => {
    useConversionStore.setState({
      selectedStep: 1,
    });
    const view = render(<UploadContent />);
    expect(view).toMatchSnapshot();
  });

  it('should render upload content', () => {
    useConversionStore.setState({
      uploadOperationLog: JSON.stringify({ foo: 'bar', baz: 'blee blue blah blueberry dee' }, null, 4),
      uploadOperationId: 'operation-id-id-operation',
      uploadUdId: 'zxcv-asdf-zxcvzxcv-asdf-dgfh',
    });
    const view = render(<UploadContent />);
    expect(view).toMatchSnapshot();
  });
});