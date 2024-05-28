import { Icon } from '@fluentui/react';
import { useEventListener } from 'hooks';
import { EVENTS } from 'hooks/useEventListener';
import { useState } from 'react';
import { mapNotificationContent, mapNotificationIcon, mapNotificationWrapper } from './index.style';

const MapNotification = props => {
  const { children } = props;
  const [closed, setClosed] = useState(false);

  useEventListener(() => {
    setClosed(true);
  }, [EVENTS.WHEEL]);

  if (!children) return null;
  if (closed) return null;

  return (
    <div className={mapNotificationWrapper}>
      <div className={mapNotificationContent}>
        <Icon className={mapNotificationIcon} iconName="Info" />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default MapNotification;
