import { azMapsCreatorTextStyle, barStyle, msftAzureTextStyle, splitterStyle } from './top-bar.style';

const TopBar = () => (
  <div className={barStyle}>
    <span className={msftAzureTextStyle}>Microsoft Azure</span>
    <span className={splitterStyle}/>
    <span className={azMapsCreatorTextStyle}>Azure Maps Creator</span>
  </div>
);

export default TopBar;