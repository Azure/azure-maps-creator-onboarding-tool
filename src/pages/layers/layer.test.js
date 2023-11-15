import { fireEvent, render, screen } from '@testing-library/react';

import Layer from './layer';
import { useLayersStore, useProgressBarStore } from 'common/store';

const props = [
  {
    id: 901,
    name: 'prop1',
    value: ['textLayer11'],
    isDraft: false,
  },
  {
    id: 902,
    name: 'prop2',
    value: ['textLayer12'],
    isDraft: false,
  },
];

const layer1 = { id: 1, value: ['polygonLayer21'], name: 'base layer', isDraft: false, props };
const layer2 = { id: 2, value: ['layer32'], name: 'int', isDraft: false, props };

describe('Layer component', () => {
  beforeEach(() => {
    useLayersStore.setState({
      textLayerNames: ['textLayer11', 'textLayer12'],
      polygonLayerNames: ['polygonLayer21', 'polygonLayer22'],
      layerNames: ['layer31', 'layer32'],
      layers: [layer1, layer2],
    });
    useProgressBarStore.setState({
      isMissingDataErrorShown: false,
    });
  });

  it('should render component', () => {
    const view = render(
      <Layer id={layer1.id} value={layer1.value} name={layer1.name} props={layer1.props} isDraft={layer1.isDraft} />
    );
    const dropdown = screen.getAllByRole('combobox');
    fireEvent.click(dropdown[0]);
    expect(view).toMatchSnapshot();
  });

  it('should delete on delete button click', () => {
    const state = useLayersStore.getState();
    const spy = jest.spyOn(state, 'deleteLayer');
    spy.mockReturnValue();
    const view = render(
      <Layer id={layer2.id} value={layer2.value} name={layer2.name} props={layer2.props} isDraft={layer2.isDraft} />
    );

    const dropdown = screen.getAllByRole('combobox');
    fireEvent.click(dropdown[0]);
    expect(view).toMatchSnapshot();

    const deleteBtn = screen.getByLabelText('delete.layer');
    fireEvent.click(deleteBtn);
    expect(spy).toHaveBeenCalled();
  });

  it('should show error', () => {
    useProgressBarStore.setState({
      isMissingDataErrorShown: true,
    });

    const view = render(
      <Layer id={layer1.id} value={[]} name={layer1.name} props={layer1.props} isDraft={layer1.isDraft} />
    );

    expect(view).toMatchSnapshot();
  });
});
