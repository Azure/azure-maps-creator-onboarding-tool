import { render } from '@testing-library/react';

import UploadContent from './upload-content';

describe('upload content', () => {
  it('should render nothing when not selected', () => {
    const view = render(<UploadContent uploadStepStatus={1} uploadOperationLog={'loooooog'} uploadUdId={'some-id'} selectedStep={1} />);
    expect(view).toMatchSnapshot();
  });

  it('should render upload content', () => {
    const operationLog = JSON.stringify({ foo: 'bar', baz: 'blee blue blah blueberry dee' }, null, 4);
    const view = render(<UploadContent uploadStepStatus={1} uploadOperationLog={operationLog} uploadUdId={'zxcv-asdf-zxcvzxcv-asdf-dgfh'} selectedStep={0} />);
    expect(view).toMatchSnapshot();
  });
});