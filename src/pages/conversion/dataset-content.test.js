import { render } from '@testing-library/react';

import DatasetContent from './dataset-content';
import { useConversionStore } from 'common/store';

describe('dataset content', () => {
  beforeEach(() => {
    useConversionStore.setState({
      selectedStep: 2,
      datasetOperationLog: null,
      datasetId: null,
    });
  });

  it('should render nothing when not selected', () => {
    useConversionStore.setState({
      selectedStep: 1,
    });
    const view = render(<DatasetContent />);
    expect(view).toMatchSnapshot();
  });

  it('should render dataset content', () => {
    useConversionStore.setState({
      datasetOperationLog: JSON.stringify({ foo: 'bar', baz: 'The rule of thumb used by most antique dealers is that anything about 100 years or older is an antique. Items that are old, but not quite that old, are called vintage.' }, null, 4),
      datasetId: 'zxcv-data-zxcvzxcv-set-dgfh',
    });
    const view = render(<DatasetContent />);
    expect(view).toMatchSnapshot();
  });
});