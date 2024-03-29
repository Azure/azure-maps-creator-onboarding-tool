import { fireEvent, render, screen } from '@testing-library/react';
import { useGeometryStore, useUserStore } from 'common/store';
import flushPromises from 'flush-promises';
import Control, { TEST_ID } from './control';
import GeoreferenceControl from './controlClass';

describe('GeoreferenceControl class', () => {
  let control, container;
  const map = { map: 'map' };

  beforeEach(async () => {
    useGeometryStore.setState({
      anchorPoint: {
        coordinates: [0, 0],
        angle: 111,
      },
    });
    useUserStore.setState({
      geography: 'EU',
      subscriptionKey: 'subKey',
    });

    jest.useFakeTimers();
    control = new GeoreferenceControl();
    container = control.onAdd(map);
    // added cause without it useEffect hook wasn't triggered properly and value was not updated correctly
    jest.advanceTimersByTime(0);

    control = new GeoreferenceControl();
    container = control.onAdd(map);

    await flushPromises();
  });

  it('onAdd should return container', async () => {
    await flushPromises();

    expect(container).toMatchSnapshot();
    expect(control.map).toBe(map);
  });

  it('onRemove should delete container and map', () => {
    control.onRemove();
    expect(true).toBe(true);
    expect(control.container).toBe(null);
    expect(control.map).toBe(null);
  });
});

describe('Control', () => {
  it('should render Control', () => {
    render(<Control />);
    expect(screen.getByTestId(TEST_ID.MAP_CONTROL)).toBeInTheDocument();
  });

  it('should center map to set coordinates', () => {
    const map = {
      setCamera: jest.fn(),
    };
    render(<Control map={map} />);

    const coordinatesRadioOption = screen.getByLabelText('search.by.lon.lat');
    fireEvent.click(coordinatesRadioOption);
    const lngInput = screen.getByPlaceholderText('longitude');
    const latInput = screen.getByPlaceholderText('latitude');

    fireEvent.change(lngInput, {
      target: {
        value: '123.123',
      },
    });
    fireEvent.change(latInput, {
      target: {
        value: '321.321',
      },
    });
    fireEvent.keyUp(lngInput, {
      code: 'Enter',
      charCode: 13,
    });

    expect(map.setCamera).not.toBeCalled();

    fireEvent.change(latInput, {
      target: {
        value: '50.99',
      },
    });
    fireEvent.keyPress(lngInput, {
      code: 'Enter',
      charCode: 13,
    });
    expect(map.setCamera).toBeCalledWith({
      center: [123.123, 50.99],
    });
  });

  it('should search address', async () => {
    global.fetch.mockReturnValue(
      Promise.resolve({
        json: () => ({
          results: [
            {
              position: {
                lon: '12.34',
                lat: '56.78',
              },
            },
          ],
        }),
      })
    );
    const map = { setCamera: jest.fn() };
    render(<Control map={map} />);
    const searchAddressInput = screen.getByPlaceholderText('search.address');
    fireEvent.change(searchAddressInput, {
      target: {
        value: '742 Evergreen Terrace',
      },
    });
    fireEvent.keyPress(searchAddressInput, {
      code: 'Enter',
      charCode: 13,
    });

    await flushPromises();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/search/address/json?subscription-key=subKey&api-version=1.0&query=742 Evergreen Terrace&limit=1'
    );
    expect(map.setCamera).toHaveBeenCalledWith({
      center: [12.34, 56.78],
      zoom: 16,
    });
  });

  it('should show error message', async () => {
    global.fetch.mockReturnValue(Promise.reject('something really bad happened'));
    const map = { setCamera: jest.fn() };
    render(<Control map={map} />);
    const searchAddressInput = screen.getByPlaceholderText('search.address');
    fireEvent.change(searchAddressInput, {
      target: {
        value: '742 Evergreen Terrace',
      },
    });
    fireEvent.keyPress(searchAddressInput, {
      code: 'Enter',
      charCode: 13,
    });

    await flushPromises();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://eu.atlas.microsoft.com/search/address/json?subscription-key=subKey&api-version=1.0&query=742 Evergreen Terrace&limit=1'
    );

    const errorMessage = await screen.findByText('request.failed');

    expect(errorMessage).toBeInTheDocument();
  });
});
