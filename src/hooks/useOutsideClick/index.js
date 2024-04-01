import useEventListener, { EVENTS } from 'hooks/useEventListener';
import { useCallback } from 'react';

const useOutsideClick = (callback, refs) => {
  const handleClickOutside = useCallback(
    event => {
      const isClickOutside = refs.every(ref => {
        return ref.current && !ref.current.contains(event.target);
      });

      if (isClickOutside) {
        callback();
      }
    },
    [callback, refs]
  );

  useEventListener(handleClickOutside, EVENTS.MOUSE_DOWN);
};

export default useOutsideClick;
