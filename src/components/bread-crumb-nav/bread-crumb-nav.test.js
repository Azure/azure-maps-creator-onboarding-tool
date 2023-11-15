import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import BreadCrumbNav from './bread-crumb-nav';
import { PATHS } from 'common';

describe('BreadCrumbNav', () => {
  it('should render - create', async () => {
    render(
      <MemoryRouter initialEntries={[PATHS.INDEX]}>
        <BreadCrumbNav />
      </MemoryRouter>
    );

    // Home > Create
    const homeButton = screen.getAllByText('home')[0];
    expect(homeButton).toBeInTheDocument();

    // Redirect test (Home)
    fireEvent.click(homeButton);

    expect(screen.getAllByText('home')[0]).toBeInTheDocument();
  });
});
