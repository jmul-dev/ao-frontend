// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import console from '../modules/console/reducers/console.reducer'

const rootReducer = combineReducers({
  console,
  router,
});

export default rootReducer;
