import { useMemo } from 'react';
import ReactJson from 'react-json-view';

import { logsContainer } from './style';

export const Log = ({ src }) => {
  const parsedSrc = useMemo(() => {
    try {
      return JSON.parse(src);
    } catch {
      return null;
    }
  }, [src]);

  if (parsedSrc === null) {
    return <pre className={logsContainer}>{parsedSrc}</pre>;
  }

  return (
    <ReactJson
      src={parsedSrc}
      iconStyle="square"
      indentWidth={2}
      displayDataTypes={false}
      name={false}
      displayObjectSize={false}
      enableClipboard={false}
      displayArrayKey={false}
    />
  );
};
