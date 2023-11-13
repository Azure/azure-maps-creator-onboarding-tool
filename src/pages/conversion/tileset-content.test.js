import { screen, render, fireEvent } from '@testing-library/react';

import TilesetContent from './tileset-content';
import { useConversionStore } from 'common/store';

jest.mock('./tileset-map', () => () => 'Tileset map here');

describe('tileset content', () => {
  beforeEach(() => {
    useConversionStore.setState({
      selectedStep: 0,
      tilesetOperationLog: null,
    });
  });

  it('should render nothing by default', () => {
    const view = render(
      <TilesetContent
        tilesetStepStatus={0}
        tilesetOperationLog={null}
        selectedStep={0}
        mapConfigurationId={null}
        tilesetId={null}
      />
    );
    expect(view).toMatchSnapshot();
  });

  it('should render tileset content', () => {
    const operationLog = JSON.stringify({ foo: 'tileset-operation-log', baz: 'blee blue blah blueberry dee' }, null, 4);
    const view = render(
      <TilesetContent
        tilesetStepStatus={1}
        tilesetOperationLog={operationLog}
        selectedStep={3}
        mapConfigurationId={'my-map-config'}
        tilesetId={'some-id'}
      />
    );
    expect(view).toMatchSnapshot();
  });
});
