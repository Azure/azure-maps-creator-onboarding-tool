import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { PATHS } from 'common';
import * as hooks from 'hooks';
import React from 'react';
import InitialView from './index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));

jest.mock('hooks', () => ({
  useCustomNavigate: jest.fn(),
}));

describe('InitialView Component', () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    mockedNavigate.mockClear();
    hooks.useCustomNavigate.mockImplementation(() => mockedNavigate);
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<InitialView />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    render(<InitialView />);
    expect(screen.getByText('Azure Maps Creator')).toBeInTheDocument();
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    expect(screen.getByTestId('view-button')).toBeInTheDocument();
    expect(screen.getByText('initial.description')).toBeInTheDocument();
  });

  it('navigates to create upload on create button click', () => {
    render(<InitialView />);
    fireEvent.click(screen.getByTestId('upload-button'));
    expect(mockedNavigate).toHaveBeenCalledWith(PATHS.CREATE_UPLOAD);
  });

  it('navigates to view conversions on view button click', () => {
    render(<InitialView />);
    fireEvent.click(screen.getByTestId('view-button'));
    expect(mockedNavigate).toHaveBeenCalledWith(PATHS.VIEW_CONVERSIONS);
  });
});
