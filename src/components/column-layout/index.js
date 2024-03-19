import { cx } from '@emotion/css';
import { columnLayout, columnLayoutInRows, columnLayoutItem } from './index.style';

const ColumnLayout = ({ className, children, forceRows = false }) => {
  return <div className={cx(columnLayout, className, { [columnLayoutInRows]: forceRows })}>{children}</div>;
};

const ColumnLayoutItem = ({ className, children }) => {
  return <div className={cx(columnLayoutItem, className)}>{children}</div>;
};

export { ColumnLayout, ColumnLayoutItem };
