import React from 'react';
import { dataEntryDivider } from './index.style';

const DataEntryDivider = ({ children }) => {
  return <div className={dataEntryDivider}>{children}</div>;
};

export default DataEntryDivider;
