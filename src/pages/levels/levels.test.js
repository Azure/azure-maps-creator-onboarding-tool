import { render } from '@testing-library/react';
import { useLevelsStore } from 'common/store';
import Levels from './levels';

const mockLevel = {
  filename: 'kitchen.dwg',
  levelName: 'Kitchen',
  ordinal: 15,
};
const mockLevel2 = {
  filename: 'ground.dwg',
  levelName: 'Ground',
  ordinal: 0,
};
const mockLevel3 = {
  filename: 'basement.dwg',
  levelName: 'Basement',
  ordinal: -1,
};
const mockLevel4 = {
  filename: 'level_2.dwg',
  levelName: 'Level 2',
  ordinal: 21,
};

// added this to emulate enzyme's shallow render for cleaner snapshots
jest.mock('./level', () => props => <div>{JSON.stringify(props)}</div>);
jest.mock('hooks', () => ({
  useFeatureFlags: () => ({ isPlacesPreview: false }),
}));

describe('Levels component', () => {
  it('should render component with 1 level', () => {
    useLevelsStore.setState({ levels: [mockLevel] });
    const view = render(<Levels />);
    expect(view).toMatchSnapshot();
  });

  it('should render component with 2 levels', () => {
    useLevelsStore.setState({ levels: [mockLevel, mockLevel2] });
    const view = render(<Levels />);
    expect(view).toMatchSnapshot();
  });

  it('should render component with 3 levels', () => {
    useLevelsStore.setState({ levels: [mockLevel, mockLevel2, mockLevel3] });
    const view = render(<Levels />);
    expect(view).toMatchSnapshot();
  });

  it('should render component with 4 levels', () => {
    useLevelsStore.setState({ levels: [mockLevel, mockLevel2, mockLevel3, mockLevel4] });
    const view = render(<Levels />);
    expect(view).toMatchSnapshot();
  });
});
