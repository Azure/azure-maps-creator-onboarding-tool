import { render } from '@testing-library/react';

import ConversionButton from './conversion-button';
import { useConversionStore } from 'common/store';

describe('conversion button', () => {
  beforeEach(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-05-19'));

    useConversionStore.setState({
      conversionStepStatus: 0,
      conversionStartTime: null,
      conversionEndTime: null,
      selectedStep: 0,
    });
  });

  it('should render conversion button', () => {
    const view = render(<ConversionButton />);
    expect(view).toMatchSnapshot();
  });

  it('should render selected conversion button', () => {
    useConversionStore.setState({
      selectedStep: 1,
    });
    const view = render(<ConversionButton />);
    expect(view).toMatchSnapshot();
  });

  it('should render selected conversion button with time', () => {
    useConversionStore.setState({
      conversionStartTime: 1684418695431,
      selectedStep: 1,
    });
    const view = render(<ConversionButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected conversion button with time diff',() => {
    useConversionStore.setState({
      conversionStartTime: 1684418695431,
      conversionEndTime: 1684418697531,
      selectedStep: 1,
    });
    const view = render(<ConversionButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected conversion button with time diff with status in progress', () => {
    useConversionStore.setState({
      conversionStepStatus: 1,
      conversionStartTime: 1684418695431,
      conversionEndTime: 1684418697531,
      selectedStep: 1,
    });
    const view = render(<ConversionButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected conversion button with time diff with status success', () => {
    useConversionStore.setState({
      conversionStepStatus: 2,
      conversionStartTime: 1684418695431,
      conversionEndTime: 1684418697531,
      selectedStep: 1,
    });
    const view = render(<ConversionButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected conversion button with time diff with status failed', () => {
    useConversionStore.setState({
      conversionStepStatus: 3,
      conversionStartTime: 1684418695431,
      conversionEndTime: 1684418697531,
      selectedStep: 1,
    });
    const view = render(<ConversionButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });
});