import { useTranslation } from 'react-i18next';

import Level from './level';
import { useLevelsStore } from 'common/store';
import PageDescription from 'components/page-description/page-description';

const levelsSelector = (s) => s.levels;

const Levels = () => {
  const { t } = useTranslation();
  const levels = useLevelsStore(levelsSelector);

  return (
    <div>
      <PageDescription description={t('page.description.levels')} />
      {levels.map((level, id) => (
        <Level key={`${level.filename}${id}`} level={level} />
      ))}
    </div>
  );
};

export default Levels;