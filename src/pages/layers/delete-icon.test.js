import { fireEvent, render, screen } from '@testing-library/react';

import DeleteIcon from './delete-icon';

describe('Layers Delete Icon', () => {
  it('should render Delete Icon', () => {
    const view = render(<DeleteIcon isDraft={false} title={'Foo'} onDelete={() => {}} />);
    expect(view).toMatchSnapshot();
  });

  it('should render nothing when isDraft is true', () => {
    const view = render(<DeleteIcon isDraft title={'Foo'} onDelete={() => {}} />);
    expect(view).toMatchSnapshot();
  });

  it('should call onDelete when clicked', () => {
    const spy = jest.fn();
    render(<DeleteIcon isDraft={false} title={'Foo'} onDelete={spy} />);
    const btn = screen.getByTestId('delete-icon');
    fireEvent.click(btn);
    expect(spy).toHaveBeenCalled();
  });
});