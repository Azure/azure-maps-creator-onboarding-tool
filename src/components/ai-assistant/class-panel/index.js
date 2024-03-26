import { PrimaryButton, TextField } from '@fluentui/react';
import { InteractionTag, InteractionTagPrimary, InteractionTagSecondary, TagGroup } from '@fluentui/react-components';
import { useUserStore } from 'common/store';
import { inputStyles, primaryButtonStyle, textFieldStyle } from 'pages/create-manifest/create-manifest.style';
import { useEffect, useState } from 'react';
import { useAssistantStore } from '../assistant.store';
import AiIcon from '../components/ai-icon';
import AiToggle from '../components/ai-toggle';
import { addInput, classPanel, mutedText, panelHeader, panelTitle, previewTag } from './index.style';

const AiClassPanel = () => {
  const [assistantEnabled, classes, setClasses, toggleAssistant] = useAssistantStore(state => [
    state.assistantEnabled,
    state.classes,
    state.setClasses,
    state.toggleAssistant,
  ]);
  const [geography] = useUserStore(store => [store.geography]);

  const handleRemoveClass = (event, target) => {
    setClasses(classes.filter(c => c !== target.value));
  };

  const [newClass, setNewClass] = useState('');
  const updateNewClass = (event, newValue) => {
    setNewClass(newValue);
  };

  const addNewClass = () => {
    setClasses([...classes, newClass]);
    setNewClass('');
  };

  const handleKeyDown = event => {
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      // Prevent the default action to avoid submitting the form if it's inside one
      event.preventDefault();
      // Call your submit function here
      addNewClass();
    }
  };

  const validGeography = geography === 'US_TEST';

  useEffect(() => {
    toggleAssistant(validGeography);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validGeography]);

  if (!validGeography) return null;

  return (
    <div className={classPanel}>
      <div className={panelHeader}>
        <div className={panelTitle}>
          <AiIcon size={24} />
          <h3>AI Assistant</h3>
        </div>
        <div className={previewTag}>Preview</div>
      </div>
      <p>AI Assistant can help you understand and select layers from your drawing files.</p>
      <AiToggle />
      {assistantEnabled && (
        <div>
          <div style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Feature Classes</h3>
            <div className={addInput}>
              <TextField
                className={textFieldStyle}
                ariaLabel="asd"
                value={newClass}
                onChange={updateNewClass}
                styles={inputStyles}
                placeholder="Type to add new feature class name"
                onKeyDown={handleKeyDown}
              />
              <PrimaryButton className={primaryButtonStyle} onClick={addNewClass}>
                Add
              </PrimaryButton>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <TagGroup onDismiss={handleRemoveClass} aria-label="Dismiss example" style={{ flexWrap: 'wrap', gap: 5 }}>
              {classes.map(tag => (
                <InteractionTag value={tag} key={tag} size="small">
                  <InteractionTagPrimary hasSecondaryAction>{tag}</InteractionTagPrimary>
                  <InteractionTagSecondary aria-label="remove" />
                </InteractionTag>
              ))}
            </TagGroup>

            <div className={mutedText}>
              *Displaying predefined list of class names you might be interested in. Feel free to add additional classes
              or remove predefined ones.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiClassPanel;
