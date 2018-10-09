// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './reducers';

export const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

export function configureStore(initialState?) {
  return createStore(rootReducer, initialState, enhancer);
}
