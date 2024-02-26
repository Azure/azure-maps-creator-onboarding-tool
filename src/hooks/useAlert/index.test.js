import { act, renderHook } from '@testing-library/react';
import useAlert from './index';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));

describe('useAlert Hook', () => {
  beforeAll(() => {
    window.confirm = jest.fn();
  });

  it('calls onOk when confirm is accepted', () => {
    window.confirm.mockImplementation(() => true);

    const onOk = jest.fn();
    const onCancel = jest.fn();

    const { result } = renderHook(() => useAlert({}));

    act(() => {
      result.current.ask({ onOk, onCancel });
    });

    expect(onOk).toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when confirm is rejected', () => {
    window.confirm.mockImplementation(() => false);

    const onOk = jest.fn();
    const onCancel = jest.fn();

    const { result } = renderHook(() => useAlert({}));

    act(() => {
      result.current.ask({ onOk, onCancel });
    });

    expect(onCancel).toHaveBeenCalled();
    expect(onOk).not.toHaveBeenCalled();
  });
});
