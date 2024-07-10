import * as React from 'react';
import PropTypes from 'prop-types';

export const MapContext = React.createContext({});

class MapProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      map: undefined,
    };
  }

  render = () => (
    <MapContext.Provider value={{ ...this.state, setMap: this.setMap }}>
      {this.props.children}
    </MapContext.Provider>
  );

  setMap = (map) => this.setState({ map });
}

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MapProvider;
