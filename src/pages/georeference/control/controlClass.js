import { render } from 'react-dom';

import Control from './control';

class GeoreferenceControl {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.classList.add('azure-maps-control-container');
    render(<Control map={this.map} />, this.container);
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
