import React from 'react';
import { mapControlsWrapper, resetButton, zoomInButton, zoomOutButton } from './index.style';

const MapControls = props => {
  const { zoomIn, zoomOut, reset } = props.controls;
  return (
    <div className={mapControlsWrapper}>
      <button className={zoomInButton} onClick={zoomIn}></button>
      <button className={zoomOutButton} onClick={zoomOut}></button>
      <button className={resetButton} onClick={reset}></button>
    </div>
  );
};

export default MapControls;
