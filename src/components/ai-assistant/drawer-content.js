import { PrimaryButton, Toggle } from '@fluentui/react';
import { PATHS } from 'common';
import { useCustomNavigate } from 'hooks';
import { useState } from 'react';
import { useAssistantStore } from './assistant.store';
import AiToggle from './components/ai-toggle';
import { actionWrapper } from './drawer.style';

const Section = props => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>{props.title}</h3>
      <p>{props.children}</p>
    </div>
  );
};

const DrawerContent = () => {
  const navigate = useCustomNavigate();
  const [assistantEnabled, suggestExterior, suggestLayers, layerDescriptions] = useAssistantStore(state => [
    state.assistantEnabled,
    state.suggestExterior,
    state.suggestLayers,
    state.layerDescriptions,
  ]);

  const [showAll, setShowAll] = useState(false);

  const handleExteriorClick = () => {
    navigate(PATHS.CREATE_GEOREFERENCE);
    suggestExterior();
  };
  const handleLayersClick = () => {
    navigate(PATHS.LAYERS);
    suggestLayers();
  };

  return (
    <div>
      <div>
        <AiToggle />
      </div>

      <div style={{ opacity: assistantEnabled ? 1 : 0.4 }}>
        <Section title="Suggestions">
          <p>You can use AI Assistant to populate fields based on your drawing files.</p>
          <div className={actionWrapper}>
            <PrimaryButton onClick={handleExteriorClick} disabled={!assistantEnabled}>
              Exterior
            </PrimaryButton>
            <PrimaryButton onClick={handleLayersClick} disabled={!assistantEnabled}>
              Layers
            </PrimaryButton>
          </div>
        </Section>
        <Section title="Explanation">
          <p>
            AI Assistant can help you understand your drawing files. Hover over layer related dropdown item to see
            explanation.
          </p>
          <Toggle
            label="Show all layers"
            disabled={!assistantEnabled}
            checked={showAll}
            onChange={(event, checked) => setShowAll(checked)}
            inlineLabel
          />
          {showAll &&
            layerDescriptions.map(item => (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 'bold' }}>{item.layerName}</div>
                <div style={{ color: '#444', paddingLeft: 8 }}>{item.layerDescription}</div>
              </div>
            ))}
        </Section>
      </div>
    </div>
  );
};

export default DrawerContent;
