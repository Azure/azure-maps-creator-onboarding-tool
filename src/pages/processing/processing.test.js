import { render } from '@testing-library/react';
import { useResponseStore, useUserStore } from 'common/store';
import ProcessingPage from './processing';

const mockT = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT }),
}));
jest.mock('hooks', () => ({
  useCustomNavigate: () => mockNavigate,
  useFeatureFlags: () => ({ isPlacesPreview: false }),
}));

describe('ProcessingPage', () => {
  beforeEach(() => {
    useUserStore.setState({
      subscriptionKey: 'subscriptionKey',
    });
    useResponseStore.setState({
      errorMessage: '',
      lroStatus: 'Uploading',
    });
  });

  it('should match snapshot', () => {
    expect(render(<ProcessingPage />)).toMatchSnapshot();
  });

  it('should navigate to create manifest page in case of error', () => {
    useResponseStore.setState({ errorMessage: 'erreur!' });
    render(<ProcessingPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
