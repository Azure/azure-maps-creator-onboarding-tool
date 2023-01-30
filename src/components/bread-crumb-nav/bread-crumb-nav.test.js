import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import BreadCrumbNav from './bread-crumb-nav';
import { PATHS } from 'common';

describe('BreadCrumbNav', () => {
  it('should render', () => {
    render(
      <MemoryRouter initialEntries={[PATHS.INDEX]}>
        <BreadCrumbNav />
      </MemoryRouter>
    );

    // Home
    let homeButton = screen.getAllByText('home')[0];
    let createButtons = screen.queryAllByText('create');
    expect(homeButton).toBeInTheDocument();
    expect(createButtons).toEqual([]);

    // Redirect test (itself)
    fireEvent.click(homeButton);

    homeButton = screen.getAllByText('home')[0];
    createButtons = screen.queryAllByText('create');
    expect(homeButton).toBeInTheDocument();
    expect(createButtons).toEqual([]);
  });

  it('should render - create', async () => {
    render(
      <MemoryRouter initialEntries={[PATHS.CREATE_MANIFEST]}>
        <BreadCrumbNav />
      </MemoryRouter>
    );

    // Home > Create
    let homeButton = screen.getAllByText('home')[0];
    let createButtons = screen.getAllByText('create')[0];
    expect(homeButton).toBeInTheDocument();
    expect(createButtons).toBeInTheDocument();

    // Redirect test (itself)
    fireEvent.click(createButtons);

    homeButton = screen.getAllByText('home')[0];
    createButtons = screen.getAllByText('create')[0];
    expect(homeButton).toBeInTheDocument();
    expect(createButtons).toBeInTheDocument();

    // Redirect test (Home)
    fireEvent.click(homeButton);

    homeButton = screen.getAllByText('home')[0];
    createButtons = screen.queryAllByText('create');
    expect(homeButton).toBeInTheDocument();
    expect(createButtons).toEqual([]);
  });

  it('should match snapshot - edit', () => {
    expect(render(
      <MemoryRouter initialEntries={[PATHS.EDIT_MANIFEST]}>
        <BreadCrumbNav />
      </MemoryRouter>)
    ).toMatchSnapshot();
  });
});