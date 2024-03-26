import { iconImage } from '../../drawer.style';
import icon from './icon.png';

const AiIcon = ({ size, color }) => {
  const getSize = () => {
    if (size === 'small') return '14px';
    if (size === 'large') return '26px';
    return size || '26px';
  };

  return (
    <div style={{ height: getSize(), width: getSize() }}>
      <img className={iconImage} src={icon} alt="ai-toggle" />
    </div>
  );
};

export default AiIcon;
