import { DefaultButton, Spinner, SpinnerSize } from '@fluentui/react';
import { clearCloudStorageData } from 'common/api/conversions';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { actionButtonsRight } from './imdf-conversion.style';
import { logsButton } from './style';

export const ClearPreviousConversions = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await clearCloudStorageData();
    setLoading(false);
    toast.success('Previous conversions deleted successfully');
  };

  return (
    <div className={actionButtonsRight}>
      {loading && <Spinner size={SpinnerSize.medium} />}
      <DefaultButton className={logsButton} onClick={handleClick} disabled={loading}>
        Delete Previous Conversions
      </DefaultButton>
    </div>
  );
};
