import { render } from '@testing-library/react';

import ConversionContent from './conversion-content';

describe('conversion content', () => {
  it('should render nothing by default', () => {
    const view = render(
      <ConversionContent
        conversionStepStatus={0}
        conversionOperationLog={null}
        selectedStep={0}
        conversionId={null}
        diagnosticPackageLocation={null}
      />
    );
    expect(view).toMatchSnapshot();
  });

  it('should render conversion content', () => {
    const view = render(
      <ConversionContent
        conversionStepStatus={1}
        selectedStep={1}
        conversionId={17}
        diagnosticPackageLocation={'http://conversion.content.com'}
        conversionOperationLog={JSON.stringify({ foo: 'bar', baz: 'blee blue blah blueberry dee' }, null, 4)}
      />
    );
    expect(view).toMatchSnapshot();
  });
});
