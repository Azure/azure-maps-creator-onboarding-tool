import { Switch } from '@fluentui/react-components';
import { useAssistantStore } from 'components/ai-assistant/assistant.store';

const AiToggle = () => {
  const [assistantEnabled, toggleAssistant] = useAssistantStore(state => [
    state.assistantEnabled,
    state.toggleAssistant,
  ]);

  const handleToggleChange = event => {
    toggleAssistant(event.currentTarget.checked);
  };

  return <Switch checked={assistantEnabled} onChange={handleToggleChange} label="Enable AI Assistant" />;
};

export default AiToggle;
