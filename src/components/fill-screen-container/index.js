import React, { useEffect, useRef, useState } from 'react';

const FillScreenContainer = props => {
  const { children, className = '', style = {}, offsetBottom = '0px', offsetRight = '0px' } = props;

  const ref = useRef();
  const [height, setHeight] = useState('unset');
  const [width, setWidth] = useState('unset');

  const mixedClassName = `fill-height-wrapper ${className}`;

  useEffect(() => {
    const top = ref.current?.getBoundingClientRect().top;
    setHeight(`calc(100vh - ${top}px - ${offsetBottom})`);
    const left = ref.current?.getBoundingClientRect().left;
    setWidth(`calc(100vw - ${left}px - ${offsetRight})`);
    // eslint-disable-next-line
  }, [ref]);

  if (typeof children === 'function')
    return (
      <div ref={ref}>
        <div className={mixedClassName} style={{ overflowY: 'auto', ...style }}>
          {children({ height, width })}
        </div>
      </div>
    );
};

export default FillScreenContainer;
