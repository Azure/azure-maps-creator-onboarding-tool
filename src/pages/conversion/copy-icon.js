import { useState, useRef } from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets, DelayedRender, Callout, Text, DirectionalHint } from '@fluentui/react';

import { copyIcon } from './style';

const styles = mergeStyleSets({
  callout: {
    padding: '0.25rem 0.5rem',
    borderRadius: 16,
    overflow: 'hidden',
    translate: '0px 0.3rem',
  },
});

const CopyIcon = ({textToCopy}) => {
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const ref = useRef(null);

  const copy = () => {
    navigator.clipboard.writeText(textToCopy);
    setIsCalloutVisible(true);
    setTimeout(() => {
      setIsCalloutVisible(false);
    }, 1000);
  };

  if (!textToCopy) {
    return null;
  }

  return (
    <>
      <span ref={ref}>
        <Icon iconName='Copy' onClick={copy} className={copyIcon} />
      </span>
      {isCalloutVisible && (
        <Callout target={ref} role='alert' directionalHint={DirectionalHint.topCenter} className={styles.callout}>
          <DelayedRender>
            <Text variant='small'>
              Copied!
            </Text>
          </DelayedRender>
        </Callout>
      )}
    </>
  );
};

export default CopyIcon;