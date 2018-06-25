// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from './app.reducer'
import console from '../modules/console/reducers/console.reducer'


const rootReducer = combineReducers({
  app,
  console,
  router,
});

export default rootReducer;
