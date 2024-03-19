/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';

const useEventListener = (handler, eventName, element) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element) element = window;
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const events = Array.isArray(eventName) ? eventName : [eventName];

    const eventListener = event => savedHandler.current(event);
    events.forEach(event => {
      element.addEventListener(event, eventListener);
    });
    return () => {
      events.forEach(event => {
        element.removeEventListener(event, eventListener);
      });
    };
  }, [eventName, element]);
};

const EVENTS = {
  MOUSE_DOWN: 'mousedown',
  MOUSE_MOVE: 'mousemove',
  MOUSE_UP: 'mouseup',
  WHEEL: 'wheel',
  RESIZE: 'resize',
};

export { EVENTS };

export default useEventListener;
