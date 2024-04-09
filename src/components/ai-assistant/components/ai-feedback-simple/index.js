import { IconButton } from '@fluentui/react';
import { useAssistantStore } from 'components/ai-assistant/assistant.store';
import toast from 'react-hot-toast';
import { dislikeIcon, feedbackWrapper, likeIcon } from './index.style';

const AiFeedbackSimple = props => {
  const { text, onFeedback = () => {} } = props;

  const [shouldDisplayFeedback, feedbackGiven, setFeedbackGiven] = useAssistantStore(state => [
    state.shouldDisplayFeedback,
    state.feedbackGiven,
    state.setFeedbackGiven,
  ]);

  const handleFeedback = () => {
    toast.success('Thank you for your feedback!');
    setFeedbackGiven();
    onFeedback();
  };

  if (!shouldDisplayFeedback || feedbackGiven) return null;

  return (
    <div className={feedbackWrapper}>
      <div>{text}</div>
      <div>
        <IconButton
          className={likeIcon}
          onClick={handleFeedback}
          iconProps={{ iconName: 'Like' }}
          data-testid="delete-icon"
        />
        <IconButton
          className={dislikeIcon}
          onClick={handleFeedback}
          iconProps={{ iconName: 'Dislike' }}
          data-testid="delete-icon"
        />
      </div>
    </div>
  );
};

export default AiFeedbackSimple;
