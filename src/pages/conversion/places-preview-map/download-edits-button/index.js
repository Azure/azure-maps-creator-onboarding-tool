import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DefaultButton } from '@fluentui/react';
// import { logsButton } from '.../style';

export const YourComponent = ({ imdfPackageLocation, units, levels, footprint}) => {
    const handleUpdateZip = () => {
      fetch(imdfPackageLocation)
        .then(response => response.arrayBuffer())
        .then(data => {
          const zip = new JSZip();
          return zip.loadAsync(data);
        })
        .then(zip => {
          zip.file('unit.geojson', JSON.stringify(units, null, 2));
          zip.file('level.geojson', JSON.stringify(levels, null, 2));
          zip.file('footprint.geojson', JSON.stringify(footprint, null, 2));
          return zip.generateAsync({ type: 'blob' });
        })
        .then(updatedZip => {
          saveAs(updatedZip, 'updated_imdf_package.zip');
        });
    };
  
    return (
      <div>
        <DefaultButton onClick={handleUpdateZip}>Download Updated IMDF</DefaultButton>
      </div>
    );
  };