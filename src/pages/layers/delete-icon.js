import { IconButton } from '@fluentui/react/lib/Button';

import { deleteIconContainer, layerIcon } from './layers.style';

const DeleteIcon = ({ required, isDraft, title, onDelete }) => {
  if (required || isDraft) {
    return null;
  }
  return (
    <div className={deleteIconContainer}>
      <IconButton title={title} onClick={onDelete} iconProps={{ iconName: 'StatusCircleErrorX' }}
                  className={layerIcon} ariaLabel={title} data-testid='delete-icon' />
    </div>
  );
};

export default DeleteIcon;