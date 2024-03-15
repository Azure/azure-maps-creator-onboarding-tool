import { Button, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { PATHS } from 'common';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AiIcon from './components/ai-icon';
import DrawerContent from './drawer-content';
import { floatingButtonWrapper, toggleButton } from './drawer.style';

const allowedPaths = [PATHS.LEVELS, PATHS.CREATE_GEOREFERENCE, PATHS.LAYERS, PATHS.REVIEW_CREATE];

const AiAssistantDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { pathname: currentPath } = useLocation();

  if (!allowedPaths.includes(currentPath)) return null;

  return (
    <>
      <Drawer type="overlay" open={isDrawerOpen} position="end" modalType="non-modal" separator size="medium">
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsDrawerOpen(false)}
              />
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AiIcon size="large" />
              <span>AI Assistant</span>
            </div>
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <DrawerContent />
        </DrawerBody>
      </Drawer>
      {!isDrawerOpen && (
        <div className={floatingButtonWrapper}>
          <div onClick={() => setIsDrawerOpen(true)} className={toggleButton}>
            <AiIcon size={32} />
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistantDrawer;
