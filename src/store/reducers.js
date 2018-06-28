// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from './app.reducer'
import wallet from '../modules/wallet/reducers/wallet.reducer'

const rootReducer = combineReducers({
    app,
    router,
    wallet,
});

export default rootReducer;
