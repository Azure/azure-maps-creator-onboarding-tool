import { formatProgressTime } from './format-time';

describe('conversion format time', () => {
  beforeEach(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-05-19'));
  });

  it('should return time diff as string', () => {
    expect(formatProgressTime(1684418695431)).toEqual('~9h 55m 4s');
    expect(formatProgressTime(1684418695431, 'qwe')).toEqual('~9h 55m 4s');
    expect(formatProgressTime(1684418695431, null)).toEqual('~9h 55m 4s');
    expect(formatProgressTime(1684418695431, NaN)).toEqual('~9h 55m 4s');
    expect(formatProgressTime(123, 300)).toEqual('');
    expect(formatProgressTime('qwe', 300)).toEqual('');
    expect(formatProgressTime(null, 300)).toEqual('');
    expect(formatProgressTime(NaN, 300)).toEqual('');
    expect(formatProgressTime(undefined, 300)).toEqual('');
    expect(formatProgressTime(123, 3000)).toEqual('~2s');
    expect(formatProgressTime(123, 30000)).toEqual('~29s');
    expect(formatProgressTime(123, 300000)).toEqual('~4m 59s');
    expect(formatProgressTime(123, 3000000)).toEqual('~49m 59s');
    expect(formatProgressTime(120003, 300000000)).toEqual('~83h 17m 59s');
    expect(formatProgressTime(1683234695431, 1684418695431)).toEqual('~328h 53m 20s');
  });
});