import { render, screen } from '@testing-library/react';
import { useFeatureFlags } from 'hooks';
import React from 'react';
import ButtonText from './index';

jest.mock('hooks', () => ({
  useFeatureFlags: jest.fn(() => ({ isPlacesPreview: false })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));

describe('ButtonText Component', () => {
  it('renders correct text when onboarding is enabled, places preview is on and it is the last step', () => {
    useFeatureFlags.mockReturnValue({ isPlacesPreview: true });

    render(<ButtonText isOnLastStep={true} />);
    expect(screen.getByText('convert')).toBeInTheDocument();
  });

  it('renders correct text when onboarding is enabled, places preview is off and it is not the last step', () => {
    useFeatureFlags.mockReturnValue({ isPlacesPreview: false });

    render(<ButtonText isOnLastStep={false} />);
    expect(screen.getByText('review.plus.create')).toBeInTheDocument();
  });
});
