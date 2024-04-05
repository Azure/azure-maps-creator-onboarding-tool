import { DefaultButton, Icon } from '@fluentui/react';
import { useLayersStore } from 'common/store';
import toast from 'react-hot-toast';
import { buttonStyle } from './index.style';

const objectToCSV = obj => {
  const csvRows = [];
  for (const [key, value] of Object.entries(obj)) {
    csvRows.push(`${key},${value}`);
  }
  return csvRows.join('\n');
};

const DownloadMapping = () => {
  const [categoryMap] = useLayersStore(s => [s.categoryMapping.categoryMap]);

  const isEmpty = Object.keys(categoryMap).length === 0;

  const downloadCSV = () => {
    const csvString = objectToCSV(categoryMap);
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'category_mapping_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Category mapping exported successfully');
  };

  return (
    <DefaultButton className={buttonStyle} onClick={downloadCSV} disabled={isEmpty}>
      <Icon iconName="Download" />
      <span>Export CSV</span>
    </DefaultButton>
  );
};

export default DownloadMapping;
