/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';

import { MapContext } from './MapProvider';

const withMap = (Component) => class WithMap extends React.PureComponent {
  render = () => (
    <MapContext.Consumer>
      {(contexts) => <Component {...this.props} {...contexts} />}
    </MapContext.Consumer>
  );
};

export default withMap;
