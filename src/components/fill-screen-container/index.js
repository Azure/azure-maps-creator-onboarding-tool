import React, { useEffect, useRef, useState } from 'react';

const FillScreenContainer = props => {
  const { children, className = '', style = {}, offsetBottom = 0, offsetRight = 0 } = props;

  const ref = useRef();
  const [pixelStyle, setPixelStyle] = useState({
    width: undefined,
    height: undefined,
  });
  const [cssStyle, setCssStyle] = useState({
    height: 'unset',
    width: 'unset',
  });

  const mixedClassName = `fill-height-wrapper ${className}`;

  useEffect(() => {
    const top = ref.current?.getBoundingClientRect().top;
    const left = ref.current?.getBoundingClientRect().left;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    setPixelStyle({
      height: windowHeight - top - offsetBottom,
      width: windowWidth - left - offsetRight,
    });

    setCssStyle({
      height: `calc(100vh - ${top}px - ${offsetBottom}px)`,
      width: `calc(100vw - ${left}px - ${offsetRight}px)`,
    });
    // eslint-disable-next-line
  }, [ref.current]);

  const { width, height } = pixelStyle;

  if (typeof children === 'function')
    return (
      <div ref={ref}>
        <div className={mixedClassName} style={{ overflowY: 'auto', ...style }}>
          {children({ width, height, cssStyle })}
        </div>
      </div>
    );
};

export default FillScreenContainer;
