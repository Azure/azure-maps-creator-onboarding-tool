import { AnyAction } from 'redux';

import { MAP_SET_FORM_MARKER_POSITION } from '../actions/actionTypes';
import { IMapState } from '../common/reduxStateTypes';

export interface IAction extends AnyAction, IMapState { }

const initialState: IMapState = {
  formMarkerPosition: undefined,
};

const setMapFormMarkerPosition = (state: IMapState, action: IAction) => ({
  ...state,
  formMarkerPosition: action.formMarkerPosition,
});

export default mapReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case MAP_SET_FORM_MARKER_POSITION:
      return setMapFormMarkerPosition(state, action);
    default:
      return state;
  }
};
