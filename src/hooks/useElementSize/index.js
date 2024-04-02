import { useEffect, useRef, useState } from 'react';
import useEventListener, { EVENTS } from '../useEventListener';

const useElementSize = () => {
  let [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useRef();

  const handleResize = () => {
    if (ref.current) {
      setSize({ width: ref.current.clientWidth, height: ref.current.clientHeight });
    }
  };

  useEffect(() => {
    handleResize();
  }, [ref.current?.clientWidth, ref.current?.clientHeight]);

  useEventListener(handleResize, EVENTS.RESIZE);

  return [ref, size];
};

export default useElementSize;
