// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import rootReducer from './reducers';

export const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);
const root = connectRouter(history)(rootReducer);

export function configureStore(initialState?) {
  return createStore(root, initialState, enhancer);
}
