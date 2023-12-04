import { act, render } from '@testing-library/react';
import { useResponseStore, useUserStore } from 'common/store';
import ProcessingPage, { REFRESH_INTERVAL } from './processing';

const refreshRateMs = REFRESH_INTERVAL * 1000;
const requestFrequency = 1;
const mockT = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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

  it('should countdown', async () => {
    const state = useResponseStore.getState();
    const spy = jest.spyOn(state, 'refreshStatus');
    jest.useFakeTimers();
    render(<ProcessingPage />);
    for (let i = 0; i < requestFrequency; i++) {
      expect(mockT).toHaveBeenCalledWith('processing.last.checked', {
        seconds: i,
      });
      act(() => {
        jest.advanceTimersByTime(refreshRateMs);
      });
    }

    expect(spy).toHaveBeenCalledWith('subscriptionKey');
    expect(spy).toHaveBeenCalledTimes(1);

    for (let i = 0; i < requestFrequency * 10; i++) {
      expect(mockT).toHaveBeenCalledWith('processing.last.checked', {
        seconds: i % 10,
      });
      act(() => {
        jest.advanceTimersByTime(refreshRateMs);
      });
    }

    expect(spy).toHaveBeenCalledTimes(11);

    jest.useRealTimers();
  });

  it('should navigate to create manifest page in case of error', () => {
    useResponseStore.setState({ errorMessage: 'erreur!' });
    render(<ProcessingPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
