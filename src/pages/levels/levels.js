import { MessageBar, MessageBarType } from '@fluentui/react';

import Level from './level';
import { useLevelsStore } from 'common/store';

const levelsSelector = (s) => s.levels;

const Levels = () => {
  const levels = useLevelsStore(levelsSelector);

  return (
    <div>
      <div style={{width: 500}}>
        <MessageBar messageBarType={MessageBarType.severeWarning} isMultiline={false}>
          {'One of the ordinals must be 0. (this is temporary hint, will be changed soon)'}
        </MessageBar>
      </div>
      {levels.map((level, id) => (
        <Level key={`${level.filename}${id}`} level={level} />
      ))}
    </div>
  );
};

export default Levels;