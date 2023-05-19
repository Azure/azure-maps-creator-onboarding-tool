import { render } from '@testing-library/react';

import Icon from './icon';
import { conversionStatuses } from 'common/store/conversion.store';

describe('conversion icon', () => {
  it('should render success icon', () => {
    const view = render(<Icon status={conversionStatuses.finishedSuccessfully} />);
    expect(view).toMatchSnapshot();
  });

  it('should render inProgress icon', () => {
    const view = render(<Icon status={conversionStatuses.inProgress} />);
    expect(view).toMatchSnapshot();
  });

  it('should render failed icon', () => {
    const view = render(<Icon status={conversionStatuses.failed} />);
    expect(view).toMatchSnapshot();
  });

  it('should render default icon when status is "empty"', () => {
    const view = render(<Icon status={conversionStatuses.empty} />);
    expect(view).toMatchSnapshot();
  });

  it('should render default icon when status is not set', () => {
    const view = render(<Icon />);
    expect(view).toMatchSnapshot();
  });
});