export const data = {
  Position: function(lng, lat) {
    return [lng, lat];
  },
};
export const math = {
  rotatePositions: (coordinates) => coordinates,
  getDestination: (coordinates) => coordinates,
  getDistanceTo: () => 155,
  getHeading: () => 45,
};
export const control = {
  StyleControl: function() {},
  ZoomControl: function() {},
};
export function Map() {
  this.controls = {
    add: () => {},
  };
}