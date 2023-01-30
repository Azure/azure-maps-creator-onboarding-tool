import { render } from '@testing-library/react';

import ReviewManifestPane from './review-manifest-pane';
import { useGeometryStore, useLayersStore, useLevelsStore } from 'common/store';

describe('ReviewManifestPane', () => {
  beforeEach(() => {
    useGeometryStore.setState({
      anchorPoint: {
        angle: 150,
        coordinates: [50, 100],
      },
    });
    useLevelsStore.setState({
      levels: [
        {
          filename: 'file 1.dwg',
          levelName: 'level 1',
          ordinal: 11,
        },
        {
          filename: 'file 222.dwg',
          levelName: 'last level',
          ordinal: 99,
        }
      ],
    });
    useLayersStore.setState({
      layers: [
        {
          name: 'first layer',
          value: ['val 1', 'val 2'],
          props: [
            {
              name: 'first prop',
              value: ['prop val 1', 'prop val N'],
            },
            {
              name: 'second prop',
              value: ['Crows often hold grudges against specific people.'],
            },
          ],
        },
        {
          name: 'last layer',
          value: ['val val val', 'lav lav lav'],
          props: [],
        }
      ],
    });
  });

  it('should render review manifest pane', () => {
    const view = render(<ReviewManifestPane />);
    expect(view).toMatchSnapshot();
  });
});