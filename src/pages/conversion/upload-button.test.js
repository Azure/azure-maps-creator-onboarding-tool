import { render } from '@testing-library/react';

import UploadButton from './upload-button';
import { useConversionStore } from 'common/store';

describe('upload button', () => {
  beforeEach(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-05-19'));

    useConversionStore.setState({
      uploadStepStatus: 0,
      uploadStartTime: null,
      uploadEndTime: null,
      selectedStep: 0,
    });
  });

  it('should render unselected upload button', () => {
    useConversionStore.setState({
      selectedStep: 1,
    });
    const view = render(<UploadButton />);
    expect(view).toMatchSnapshot();
  });

  it('should render selected upload button', () => {
    const view = render(<UploadButton />);
    expect(view).toMatchSnapshot();
  });

  it('should render selected upload button with time', () => {
    useConversionStore.setState({
      uploadStartTime: 1684418695431,
    });
    const view = render(<UploadButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected upload button with time diff',() => {
    useConversionStore.setState({
      uploadStartTime: 1684418695431,
      uploadEndTime: 1684418697531,
    });
    const view = render(<UploadButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected upload button with time diff with status in progress', () => {
    useConversionStore.setState({
      uploadStepStatus: 1,
      uploadStartTime: 1684418695431,
      uploadEndTime: 1684418697531,
    });
    const view = render(<UploadButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected upload button with time diff with status success', () => {
    useConversionStore.setState({
      uploadStepStatus: 2,
      uploadStartTime: 1684418695431,
      uploadEndTime: 1684418697531,
    });
    const view = render(<UploadButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });

  it('should render selected upload button with time diff with status failed', () => {
    useConversionStore.setState({
      uploadStepStatus: 3,
      uploadStartTime: 1684418695431,
      uploadEndTime: 1684418697531,
    });
    const view = render(<UploadButton />);
    jest.advanceTimersByTime(1000);
    expect(view).toMatchSnapshot();
  });
});