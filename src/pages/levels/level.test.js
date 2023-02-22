import { fireEvent, render, screen } from '@testing-library/react';

import Level from './level';
import { useLevelsStore, useProgressBarStore } from 'common/store';

const mockLevel = {
  filename: 'kitchen.dwg',
  levelName: 'Kitchen',
  ordinal: '5',
};

describe('Level component', () => {
  beforeEach(() => {
    useProgressBarStore.setState({
      isErrorShown: false,
    });
  });

  it('should render component', () => {
    const view = render(<Level level={mockLevel} />);
    expect(view).toMatchSnapshot();
  });

  it('should show error', () => {
    const emptyLevel = { filename: 'kitchen.dwg', levelName: '', ordinal: '' };
    useProgressBarStore.setState({
      isErrorShown: true,
    });

    const view = render(<Level level={emptyLevel} />);
    expect(view).toMatchSnapshot();
  });

  it('should call setOrdinal on ordinal change', async () => {
    const state = useLevelsStore.getState();
    const spy = jest.spyOn(state, 'setOrdinal');
    render(<Level level={mockLevel} />);
    const input = await screen.findByDisplayValue('5');

    fireEvent.change(input, {
      target: {
        value: '6',
      }
    });
    expect(spy).toHaveBeenCalledWith( 'kitchen.dwg', '6');
  });

  it('should call setLevelName on levelName change', async () => {
    const state = useLevelsStore.getState();
    const spy = jest.spyOn(state, 'setLevelName');
    render(<Level level={mockLevel} />);
    const input = await screen.findByDisplayValue('Kitchen');

    fireEvent.change(input, {
      target: {
        value: 'Ground',
      }
    });
    expect(spy).toHaveBeenCalledWith( 'kitchen.dwg', 'Ground');
  });

  it('should show error message when ordinal is not unique', () => {
    useLevelsStore.setState({
      levels: [mockLevel, { filename: 'filename', levelName: 'levelName', ordinal: '5' }],
    });
    const view = render(<Level level={mockLevel} />);
    expect(view).toMatchSnapshot();
  });

  it('should show error message when level name contains invalid chars', () => {
    const veryLongName = 'asdfjhclsadfhbcalskjdfhcblksdfhcbalksdfhjcbalskdfjhcbalskdfhcblaskfdjhcblaskfjhcbalskfhjcbalskfhjcblaskjfhcbasdlfkhjcb';
    const level = { filename: 'filename', levelName: veryLongName, ordinal: '5' };
    const view = render(<Level level={level} />);
    expect(view).toMatchSnapshot();
  });
});