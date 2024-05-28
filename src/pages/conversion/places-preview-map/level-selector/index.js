import { cx } from '@emotion/css';
import { useMemo } from 'react';
import { buttonStyle, levelSelectorWrapper, selectedButtonStyle } from './index.style';

const LevelSelector = props => {
  const { options, selectedKey, onChange = () => {} } = props;

  const handleLevelClick = levelId => {
    onChange(levelId);
  };

  const reversedOptions = useMemo(() => options.slice().reverse(), [options]);

  return (
    <div className={levelSelectorWrapper}>
      {reversedOptions.map(option => (
        <button
          key={option.key}
          className={cx(buttonStyle, { [selectedButtonStyle]: option.key === selectedKey })}
          onClick={() => handleLevelClick(option.key)}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
