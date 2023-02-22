import { render } from '@testing-library/react';

import ProgressBarIcon from './progress-bar-icon';
import { useProgressBarStore } from 'common/store';

describe('ProgressBarIcon', () => {
  beforeEach(() => {
    useProgressBarStore.setState({
      isErrorShown: false,
    });
  });

  it('should render error icon', () => {
    useProgressBarStore.setState({
      isErrorShown: true,
    });
    const view = render(<ProgressBarIcon label={'foo'} isCompletedStep={false} />);
    expect(view).toMatchSnapshot();
  });

  it('should render normal icon', () => {
    const view = render(<ProgressBarIcon label={'bar'} isCompletedStep={false} />);
    expect(view).toMatchSnapshot();
  });

  it('should render completed icon', () => {
    const view = render(<ProgressBarIcon label={'baz'} isCompletedStep />);
    expect(view).toMatchSnapshot();
  });
});