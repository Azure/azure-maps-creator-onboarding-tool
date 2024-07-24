import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from '../reducers';

// Middlewares go here
const middleware = {};

const configureStore = (initialState) => createStore(
  rootReducer,
  initialState,
  // Redux Dev Tools Middleware
  composeWithDevTools(applyMiddleware(...middleware)),
);

// pass an optional param to rehydrate state on app start
const store = configureStore();

// export store singleton instance
export default store;
