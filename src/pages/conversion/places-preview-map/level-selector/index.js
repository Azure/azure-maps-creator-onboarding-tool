import Dropdown from 'components/dropdown';
import { previewDropdownStyles } from 'pages/layers/preview-map/map-filters/index.style';

const LevelSelector = props => {
  const { options, selectedKey, onChange = () => {} } = props;

  const handleChange = (event, item) => {
    onChange(item.optionValue);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div>Preview level:</div>
      <Dropdown
        selectedKey={selectedKey}
        onOptionSelect={handleChange}
        className={previewDropdownStyles}
        options={options}
      >
        {options.find(item => item.key === selectedKey)?.text || 'Select a level'}
      </Dropdown>
    </div>
  );
};

export default LevelSelector;
