import { cx } from '@emotion/css';
import { useState } from 'react';
import { buttonStyle, layerSelectorWrapper, selectedButtonStyle } from './index.style';

const layerButtons = [
  // will need to add a "buildingButton" once basemap is loaded
  {id: 'fullViewButton', text: 'full view'}, 
  {id: 'footprintButton', text: 'footprint.geojson'},
  {id: 'levelButton', text: 'level.geojson'},
  {id: 'unitButton', text: 'unit.geojson'},
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
