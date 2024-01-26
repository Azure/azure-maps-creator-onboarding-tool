import { createRoot } from 'react-dom/client';
import Control from './control';

class GeoreferenceControl {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.classList.add('azure-maps-control-container');

    const root = createRoot(this.container);

    root.render(<Control map={this.map} />);
    return this.container;
  }

  onRemove() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    this.map = null;
  }
}

export default GeoreferenceControl;
