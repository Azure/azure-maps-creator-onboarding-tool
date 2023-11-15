import { fireEvent, render, screen } from '@testing-library/react';

import Property from './property';
import { useLayersStore } from 'common/store';

describe('Property component', () => {
  beforeEach(() => {
    useLayersStore.setState({
      textLayerNames: ['textLayer1', 'textLayer2', 'textLayer3'],
      layers: [
        {
          id: 'id12',
          value: ['polygonLayer21'],
          name: 'base layer',
          isDraft: false,
          props: [
            {
              id: 'id11',
              name: 'Propp',
              value: ['textLayer2', 'textLayer3'],
              isDraft: false,
            },
          ],
        },
      ],
    });
  });

  it('should render component', () => {
    const view = render(
      <Property parentId={'id12'} id={'id11'} name="Propp" value={['textLayer2', 'textLayer3']} isDraft={false} />
    );
    expect(view).toMatchSnapshot();
  });

  it('should render options correctly', () => {
    const view = render(
      <Property parentId={'id12'} id={'id11'} name="Propp" value={['textLayer2', 'textLayer3']} isDraft={false} />
    );
    const dropdown = screen.getByRole('combobox');
    fireEvent.click(dropdown);
    expect(view).toMatchSnapshot();
  });

  it('should call updateProperty when changing selected options', () => {
    const state = useLayersStore.getState();
    const spy = jest.spyOn(state, 'updateProperty');
    render(
      <Property parentId={'id12'} id={'id11'} name="Propp" value={['textLayer2', 'textLayer3']} isDraft={false} />
    );
    const dropdown = screen.getByRole('combobox');
    fireEvent.click(dropdown);
    const optionsList = screen.getAllByRole('menuitemcheckbox');
    fireEvent.click(optionsList[0]);
    expect(spy).toHaveBeenCalledWith('id12', 'id11', { value: ['textLayer2', 'textLayer3', 'textLayer1'] });
  });

  it('should delete prop when delete button was clicked', () => {
    const state = useLayersStore.getState();
    const spy = jest.spyOn(state, 'deleteProperty');
    render(
      <Property parentId={'id12'} id={'id11'} name="Propp" value={['textLayer2', 'textLayer3']} isDraft={false} />
    );
    const deleteBtn = screen.getByLabelText('delete.property');
    fireEvent.click(deleteBtn);
    expect(spy).toHaveBeenCalled();
  });
});
