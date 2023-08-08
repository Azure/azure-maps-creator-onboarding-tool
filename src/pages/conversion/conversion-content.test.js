import { render } from '@testing-library/react';

import ConversionContent from './conversion-content';
import { useConversionStore } from 'common/store';

describe('conversion content', () => {
  beforeEach(() => {
    useConversionStore.setState({
      selectedStep: 0,
      conversionOperationLog: null,
      conversionId: null,
      diagnosticPackageLocation: null,
    });
  });

  it('should render nothing by default', () => {
    const view = render(<ConversionContent />);
    expect(view).toMatchSnapshot();
  });

  it('should render conversion content', () => {
    useConversionStore.setState({
      selectedStep: 1,
      conversionOperationLog: JSON.stringify({ foo: 'bar', baz: 'blee blue blah blueberry dee'}, null, 4),
      conversionId: 17,
      diagnosticPackageLocation: 'http://conversion.content.com',
    });
    const view = render(<ConversionContent />);
    expect(view).toMatchSnapshot();
  });
});