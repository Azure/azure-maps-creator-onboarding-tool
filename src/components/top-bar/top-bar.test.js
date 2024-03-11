import { render, screen } from '@testing-library/react';

import TopBar from './top-bar';

jest.mock('hooks', () => ({
  useFeatureFlags: () => ({ isPlacesPreview: false }),
}));

describe('TopBar', () => {
  it('should match snapshot', () => {
    expect(render(<TopBar />)).toMatchSnapshot();
  });

  it('should render', () => {
    render(<TopBar />);
    const textSpanElement0 = screen.getByText(/Microsoft Azure/i);
    const textSpanElement1 = screen.getByText(/Azure Maps Creator/i);

    const elements = [textSpanElement0, textSpanElement1];

    elements.forEach(textElement => {
      expect(textElement).toBeInTheDocument();
    });
  });
});
