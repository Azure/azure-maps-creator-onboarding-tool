import { useTranslation } from 'react-i18next';

const useAlert = params => {
  const { t } = useTranslation();

  const ask = overrides => {
    const { onOk = () => {}, onCancel = () => {} } = { ...params, ...overrides };
    if (window.confirm(t('progress.will.be.lost'))) {
      onOk();
    } else {
      onCancel();
    }
  };

  return { ask };
};

export default useAlert;
