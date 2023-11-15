import { render } from 'react-dom';

import GeoreferenceControl from './controlClass';
import Control from './control';

const map = 'map!';

jest.mock('react-dom', () => ({
  render: jest.fn(),
}));

describe('GeoreferenceControl', () => {
  it('should render map on add', () => {
    const instance = new GeoreferenceControl();
    const returnVal = instance.onAdd(map);
    expect(instance.container.outerHTML).toBe('<div class="azure-maps-control-container"></div>');
    expect(instance.map).toBe(map);
    expect(render).toHaveBeenCalledWith(<Control map="map!" />, instance.container);
    expect(returnVal).toBe(instance.container);
  });

  it('should clear map and container on remove', () => {
    const mockRemove = jest.fn();
    const instance = new GeoreferenceControl();
    instance.onAdd(map);
    instance.container.remove = mockRemove;

    expect(instance.container.outerHTML).toBe('<div class="azure-maps-control-container"></div>');
    expect(instance.map).toBe(map);

    instance.onRemove(map);

    expect(instance.container).toBeNull();
    expect(instance.map).toBeNull();
    expect(mockRemove).toHaveBeenCalled();
  });
});
