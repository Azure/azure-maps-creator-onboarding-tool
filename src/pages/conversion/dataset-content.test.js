import { render } from '@testing-library/react';

import DatasetContent from './dataset-content';

describe('dataset content', () => {
  it('should render nothing when not selected', () => {
    const view = render(
      <DatasetContent datasetStepStatus={0} datasetOperationLog={'http://log.com'} datasetId={152} selectedStep={1} />
    );
    expect(view).toMatchSnapshot();
  });

  it('should render dataset content', () => {
    const operationLog = JSON.stringify(
      {
        foo: 'bar',
        baz: 'The rule of thumb used by most antique dealers is that anything about 100 years or older is an antique. Items that are old, but not quite that old, are called vintage.',
      },
      null,
      4
    );
    const view = render(
      <DatasetContent
        datasetStepStatus={1}
        datasetOperationLog={operationLog}
        datasetId={'zxcv-data-zxcvzxcv-set-dgfh'}
        selectedStep={2}
      />
    );
    expect(view).toMatchSnapshot();
  });
});
