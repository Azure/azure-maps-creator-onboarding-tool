import { screen, render, fireEvent } from '@testing-library/react';

import ConversionContent from './conversion-content';
import { useConversionStore } from 'common/store';

describe('conversion content', () => {
  beforeEach(() => {
    useConversionStore.setState({
      selectedStep: 0,
      conversionOperationLog: null,
      conversionOperationId: null,
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
      conversionOperationId: 'qqwer-asdf-zxcvzxcv-asdf-dgfh',
      conversionId: 17,
      diagnosticPackageLocation: 'http://conversion.content.com',
    });
    const view = render(<ConversionContent />);
    expect(view).toMatchSnapshot();
  });

  it('should render conversion content logs tab', () => {
    useConversionStore.setState({
      selectedStep: 1,
      conversionOperationLog: JSON.stringify({ foo: 'bar', baz: 'blee blue blah blueberry dee'}, null, 4),
      conversionOperationId: 'qqwer-asdf-zxcvzxcv-asdf-dgfh',
      conversionId: 17,
      diagnosticPackageLocation: 'http://conversion.content.com',
    });
    const view = render(<ConversionContent />);
    const logsTab = screen.getByText('logs');
    fireEvent.click(logsTab);
    expect(view).toMatchSnapshot();
  });
});