import { cx } from '@emotion/css';
import { useState } from 'react';
import { buttonStyle, layerSelectorWrapper, selectedButtonStyle } from './index.style';

const layerButtons = [
  {id: 'unitButton', text: 'unit.geojson'},
  {id: 'levelButton', text: 'level.geojson'},
  {id: 'footprintButton', text: 'footprint.geojson'},
  {id: 'buildingButton', text: 'building.geojson'},
  {id: 'fullViewButton', text: 'full view'}, 
];

const LayerSelector = props => {
    const {onChange = () => {} } = props;
    const [selectedButtonId, setSelectedButtonId] = useState(null);

    const handleLayerClick = (id) => {
        setSelectedButtonId(id); 
        onChange(id);
    };

  return (
    <div className={layerSelectorWrapper}>
      {layerButtons.map(button => (
        <button
          className={cx(buttonStyle, {[selectedButtonStyle]: selectedButtonId === button.id})}
          id={button.id}
          onClick={() => handleLayerClick(button.id)}
        >
          {button.text}
        </button>
      ))}   
    </div>
  );
};

export default LayerSelector;
