import { act, render } from '@testing-library/react';
import { useConversionStore } from 'common/store';
import StepButton from './step-button';

describe('step button', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-19'));

    useConversionStore.setState({
      selectedStep: 0,
    });
  });

  it('should render unselected step button', () => {
    useConversionStore.setState({
      selectedStep: 1,
    });
    const view = render(<StepButton status={0} label="step-btn-label" title="step-btn-title" step={0} />);
    expect(view).toMatchSnapshot();
  });

  it('should render selected step button', () => {
    const view = render(<StepButton status={0} label="step-btn-label" title="step-btn-title" step={0} />);
    expect(view).toMatchSnapshot();
  });

  it('should render selected step button with time', () => {
    const view = render(
      <StepButton startTime={1684418695431} status={0} label="step-btn-label" title="step-btn-title" step={0} />
    );
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(view).toMatchSnapshot();
  });

  it('should render selected step button with time diff', async () => {
    const view = render(
      <StepButton
        endTime={1684418697531}
        startTime={1684418695431}
        status={0}
        label="step-btn-label"
        title="step-btn-title"
        step={0}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(view).toMatchSnapshot();
  });

  it('should render selected step button with time diff with status in progress', () => {
    const view = render(
      <StepButton
        endTime={1684418697531}
        startTime={1684418695431}
        status={1}
        label="step-btn-label"
        title="step-btn-title"
        step={0}
      />
    );
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(view).toMatchSnapshot();
  });

  it('should render selected step button with time diff with status success', () => {
    const view = render(
      <StepButton
        endTime={1684418697531}
        startTime={1684418695431}
        status={2}
        label="step-btn-label"
        title="step-btn-title"
        step={0}
      />
    );
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(view).toMatchSnapshot();
  });

  it('should render selected step button with time diff with status failed', () => {
    const view = render(
      <StepButton
        endTime={1684418697531}
        startTime={1684418695431}
        status={3}
        label="step-btn-label"
        title="step-btn-title"
        step={0}
      />
    );
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(view).toMatchSnapshot();
  });
});
