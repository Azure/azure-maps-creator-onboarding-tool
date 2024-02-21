import { createRoot } from 'react-dom/client';
import Control from './control';
import GeoreferenceControl from './controlClass';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

describe('GeoreferenceControl', () => {
  let map;
  let rootMock;

  beforeEach(() => {
    map = 'map!';
    rootMock = { render: jest.fn() };
    createRoot.mockReturnValue(rootMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should render map on add', () => {
    const instance = new GeoreferenceControl();
    const returnVal = instance.onAdd(map);

    expect(createRoot).toHaveBeenCalledWith(instance.container);
    expect(rootMock.render).toHaveBeenCalledWith(<Control map={map} />);
    expect(instance.container.outerHTML).toBe('<div class="azure-maps-control-container"></div>');
    expect(instance.map).toBe(map);
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
